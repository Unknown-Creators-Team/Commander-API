/**
 * 
 * ░█████╗░░█████╗░███╗░░░███╗███╗░░░███╗░█████╗░███╗░░██╗██████╗░███████╗██████╗░  ░█████╗░██████╗░██╗
 * ██╔══██╗██╔══██╗████╗░████║████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝██╔══██╗  ██╔══██╗██╔══██╗██║
 * ██║░░╚═╝██║░░██║██╔████╔██║██╔████╔██║███████║██╔██╗██║██║░░██║█████╗░░██████╔╝  ███████║██████╔╝██║
 * ██║░░██╗██║░░██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚████║██║░░██║██╔══╝░░██╔══██╗  ██╔══██║██╔═══╝░██║
 * ╚█████╔╝╚█████╔╝██║░╚═╝░██║██║░╚═╝░██║██║░░██║██║░╚███║██████╔╝███████╗██║░░██║  ██║░░██║██║░░░░░██║
 * ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░╚══════╝╚═╝░░╚═╝  ╚═╝░░╚═╝╚═╝░░░░░╚═╝
 * 
 * @LICENSE GNU General Public License v3.0
 * @AUTHORS Nano, arutaka
 * @LINK https://github.com/191225/Commander-API
 */

import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";
import tickEvent from "./lib/TickEvent";
import { Database, ExtendedDatabase } from "./lib/Database";
import { setVariable, getScore } from "./util";
import Config from "./config";

export class UI {
    /**
     * 
     * @param {Minecraft.Player} player 
     */
    constructor(player) {
        this.player = player;
    }

    Menu() { try {
        this.player.removeTag("Capi:open_config_gui");
        const Form = new MinecraftUI.ActionFormData()
        .title("§lCommander API")
        .body("設定の変更後は §7/reload§r を実行して設定を反映させてください。")
        .button("§lプレイヤー退出メッセージ")
        .button("§lチャットUI")
        .button("§l送信キャンセル")
        .button("§lタグ削除までのTick")
        .button("§l§4リセット")
        .button("§l§c閉じる")
        .show(this.player).then(response => {
            if (response.selection === 0) this.LeaveMsg();
            if (response.selection === 1) this.ChatUI();
            if (response.selection === 2) this.CancelSendMsg();
            if (response.selection === 3) this.TagWillRemoveTick();
            if (response.selection === 4) Config.clear();
        });
    } catch (e) {console.error(e)}}

    LeaveMsg() { try {
        const Form = new MinecraftUI.ActionFormData()
        .title("§lCommander API")
        .body(`ステータス: ${Config.get("LeaveMsgEnabled") ? "有効" : "無効"}\nメッセージ: "${Config.get("LeaveMsg")}"`)
        .button("§l設定する");
        if (Config.get("LeaveMsgEnabled")) Form.button("§l§c無効にする");
            else Form.button("§l§2有効にする");
    
        Form.button("§l戻る")
        .button("§l§c閉じる")
        .show(this.player).then(response => {
            if (response.selection === 0) this.LeaveMsgConfig();
            if (response.selection === 1) {
                if (Config.get("LeaveMsgEnabled")) Config.set("LeaveMsgEnabled", false);
                    else Config.set("LeaveMsgEnabled", true);
                this.LeaveMsg();
            }
            if (response.selection === 2) this.Menu();
        });
    } catch (e) {console.error(e)}}

    LeaveMsgConfig() {
        const Form = new MinecraftUI.ModalFormData()
        .title("§lCommander API")
        .textField("メッセージ", "(例) {name} がサーバーから抜けた！", Config.get("LeaveMsg") || null)
        .show(this.player).then(response => {
            if (response.formValues && response.formValues[0]?.length) Config.set("LeaveMsg", String(response.formValues[0]));
                else if (!response.canceled) Config.set("LeaveMsg", null);
            this.LeaveMsg();
        });
    }

    ChatUI() {
        const Form = new MinecraftUI.ActionFormData()
        .title("§lCommander API")
        .body(`ステータス: ${Config.get("ChatUIEnabled") ? "有効" : "無効"}\nUI: "${Config.get("ChatUI")}"`)
        .button("§l設定する");
        if (Config.get("ChatUIEnabled")) Form.button("§l§c無効にする");
            else Form.button("§l§2有効にする");
    
        Form.button("§l戻る")
        .button("§l§c閉じる")
        .show(this.player).then(response => {
            if (response.selection === 0) this.ChatUIConfig();
            if (response.selection === 1) {
                if (Config.get("ChatUIEnabled")) Config.set("ChatUIEnabled", false);
                    else Config.set("ChatUIEnabled", true);
                    this.ChatUI();
            }
            if (response.selection === 2) this.Menu();
        });
    }

    ChatUIConfig() {
    
        const Form = new MinecraftUI.ModalFormData()
        .title("§lCommander API")
        .textField("UI", "(例) {name} >> {message}", Config.get("ChatUI") || null)
        .show(this.player).then(response => {
            if (response.formValues && response.formValues[0]?.length) Config.set("ChatUI", String(response.formValues[0]));
                else if (!response.canceled) Config.set("ChatUI", null);
            this.ChatUI();
        });
    }

    CancelSendMsg () {
        const Form = new MinecraftUI.ActionFormData()
        .title("§lCommander API")
        .body(`ステータス: ${Config.get("CancelSendMsgEnabled") ? "有効" : "無効"}\nで始まっているか: "§a${Config.get("CancelSendMsg")?.start.join("§r, §a")}§r"\nで終わっているか: "§a${Config.get("CancelSendMsg")?.end.join("§r, §a")}§r"\nが含まれているか: "§a${Config.get("CancelSendMsg")?.include.join("§r, §a")}§r"`)
        .button("§l設定する");
        if (Config.get("CancelSendMsgEnabled")) Form.button("§l§c無効にする");
            else Form.button("§l§2有効にする");
    
        Form.button("§l戻る")
        .button("§l§c閉じる")
        .show(this.player).then(response => {
            if (response.selection === 0) this.CancelSendMsgConfig();
            if (response.selection === 1) {
                if (Config.get("CancelSendMsgEnabled")) Config.set("CancelSendMsgEnabled", false);
                    else Config.set("CancelSendMsgEnabled", true);
                    this.CancelSendMsg();
            }
            if (response.selection === 2) this.Menu();
        });
    }

    CancelSendMsgConfig () {
        const Form = new MinecraftUI.ModalFormData()
        .title("§lCommander API")
        .textField("で始まっているか", "(例) !, ?, #", Config.get("CancelSendMsg")?.start.join(", ") || null)
        .textField("で終わっているか", "(例) ,, ., :)", Config.get("CancelSendMsg")?.end.join(", ") || null)
        .textField("が含まれているか", "(例) help, !Form", Config.get("CancelSendMsg")?.include.join(", ") || null)
        .show(this.player).then(response => {
            if (response.formValues) {
                const object = {
                    start: response.formValues[0]?.split(", "),
                    end: response.formValues[1]?.split(", "),
                    include: response.formValues[2]?.split(", ")
                }
                Config.set("CancelSendMsg", object);
            }
            
            this.CancelSendMsg();
        });
    }

    TagWillRemoveTick() {
        const Form = new MinecraftUI.ActionFormData()
        .title("§lCommander API")
        .body(`ステータス: ${Config.get("TagWillRemoveTickEnabled") ? "有効" : "無効"}\nTick: "${Config.get("TagWillRemoveTick")}"`)
        .button("§l設定する");
        if (Config.get("TagWillRemoveTickEnabled")) Form.button("§l§c無効にする");
            else Form.button("§l§2有効にする");
    
        Form.button("§l戻る")
        .button("§l§c閉じる")
        .show(this.player).then(response => {
            if (response.selection === 0) this.TagWillRemoveTickConfig();
            if (response.selection === 1) {
                if (Config.get("TagWillRemoveTickEnabled")) Config.set("TagWillRemoveTickEnabled", false);
                    else Config.set("TagWillRemoveTickEnabled", true);
                    this.TagWillRemoveTick();
            }
            if (response.selection === 2) this.Menu();
        });
    }

    TagWillRemoveTickConfig() {
        const Form = new MinecraftUI.ModalFormData()
        .title("§lCommander API")
        .textField("Tick", "(例) 20", String(Config.get("TagWillRemoveTick")) || "20")
        .show(this.player).then(response => {
            if (response.formValues && response.formValues[0].length) Config.set("TagWillRemoveTick", Number(response.formValues[0]));
                else if (!response.canceled) Config.set("TagWillRemoveTick", null);
            this.TagWillRemoveTick();
        });
    }
}