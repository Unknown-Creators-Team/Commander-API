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
import getScore from "./lib/getScore";
import { Database, ExtendedDatabase } from "./lib/Database";
import { setVariable } from "./util";
import Config from "./config";


export function Menu(player) {
    player.removeTag("Capi:open_config_gui");
    const Menu = new MinecraftUI.ActionFormData()
    .title("§lCommander API")
    .body("設定の変更後は §7/reload§r を実行して設定を反映させてください。")
    .button("§lプレイヤー退出メッセージ")
    .button("§lチャットUI")
    .button("§l送信キャンセル")
    .button("§l§4リセット")
    .button("§l§c閉じる")
    .show(player).then(response => {
        if (response.selection === 0) LeaveMsg(player);
        if (response.selection === 1) ChatUI(player);
        if (response.selection === 2) CancelSendMsg(player);
        if (response.selection === 3) Config.clear();
    });
}

const MenuBack = (player) => Menu(player);

function LeaveMsg(player) {
    const Menu = new MinecraftUI.ActionFormData()
    .title("§lCommander API")
    .body(`ステータス: ${Config.get("LeaveMsgEnabled") ? "有効" : "無効"}\nメッセージ: "${Config.get("LeaveMsg")}"`)
    .button("§l設定する");
    if (Config.get("LeaveMsgEnabled")) Menu.button("§l§c無効にする");
        else Menu.button("§l§2有効にする");

    Menu.button("§l戻る")
    .button("§l§c閉じる")
    .show(player).then(response => {
        if (response.selection === 0) LeaveMsgConfig(player);
        if (response.selection === 1) {
            if (Config.get("LeaveMsgEnabled")) Config.set("LeaveMsgEnabled", false);
                else Config.set("LeaveMsgEnabled", true);
                LeaveMsgBack(player);
        }
        if (response.selection === 2) MenuBack(player);
    });
}

function LeaveMsgConfig(player) {
    const Menu = new MinecraftUI.ModalFormData()
    .title("§lCommander API")
    .textField("メッセージ", "(例) {name} がサーバーから抜けた！", Config.get("LeaveMsg") || null)
    .show(player).then(response => {
        if (response.formValues[0].length) Config.set("LeaveMsg", String(response.formValues[0]));
            else if (!response.canceled) Config.set("LeaveMsg", null);
        LeaveMsgBack(player);
    });
}

const LeaveMsgBack = (player) => LeaveMsg(player);

function ChatUI(player) {
    const Menu = new MinecraftUI.ActionFormData()
    .title("§lCommander API")
    .body(`ステータス: ${Config.get("ChatUIEnabled") ? "有効" : "無効"}\nUI: "${Config.get("ChatUI")}"`)
    .button("§l設定する");
    if (Config.get("ChatUIEnabled")) Menu.button("§l§c無効にする");
        else Menu.button("§l§2有効にする");

    Menu.button("§l戻る")
    .button("§l§c閉じる")
    .show(player).then(response => {
        if (response.selection === 0) ChatUIConfig(player);
        if (response.selection === 1) {
            if (Config.get("ChatUIEnabled")) Config.set("ChatUIEnabled", false);
                else Config.set("ChatUIEnabled", true);
                ChatUIBack(player);
        }
        if (response.selection === 2) MenuBack(player);
    });
}

function ChatUIConfig(player) {
    
    const Menu = new MinecraftUI.ModalFormData()
    .title("§lCommander API")
    .textField("UI", "(例) {name} >> {message}", Config.get("ChatUI") || null)
    .show(player).then(response => {
        if (response.formValues[0].length) Config.set("ChatUI", String(response.formValues[0]));
            else if (!response.canceled) Config.set("ChatUI", null);
        ChatUIBack(player);
    });
}

const ChatUIBack = (player) => ChatUI(player);

function CancelSendMsg (player) {
    const Menu = new MinecraftUI.ActionFormData()
    .title("§lCommander API")
    .body(`ステータス: ${Config.get("CancelSendMsgEnabled") ? "有効" : "無効"}\nで始まっているか: "§a${Config.get("CancelSendMsg")?.start.join("§r, §a")}§r"\nで終わっているか: "§a${Config.get("CancelSendMsg")?.end.join("§r, §a")}§r"\nが含まれているか: "§a${Config.get("CancelSendMsg")?.include.join("§r, §a")}§r"`)
    .button("§l設定する");
    if (Config.get("CancelSendMsgEnabled")) Menu.button("§l§c無効にする");
        else Menu.button("§l§2有効にする");

    Menu.button("§l戻る")
    .button("§l§c閉じる")
    .show(player).then(response => {
        if (response.selection === 0) CancelSendMsgConfig(player);
        if (response.selection === 1) {
            if (Config.get("CancelSendMsgEnabled")) Config.set("CancelSendMsgEnabled", false);
                else Config.set("CancelSendMsgEnabled", true);
                CancelSendMsgBack(player);
        }
        if (response.selection === 2) MenuBack(player);
    });
}

function CancelSendMsgConfig (player) {
    const Menu = new MinecraftUI.ModalFormData()
    .title("§lCommander API")
    .textField("で始まっているか", "(例) !, ?, #", Config.get("CancelSendMsg")?.start.join(", ") || null)
    .textField("で終わっているか", "(例) ,, ., :)", Config.get("CancelSendMsg")?.end.join(", ") || null)
    .textField("が含まれているか", "(例) help, !menu", Config.get("CancelSendMsg")?.include.join(", ") || null)
    .show(player).then(response => {
        const object = {
            start: response.formValues[0].split(", "),
            end: response.formValues[1].split(", "),
            include: response.formValues[2].split(", ")
        }
        Config.set("CancelSendMsg", object);
        CancelSendMsgBack(player);
    });
}

const CancelSendMsgBack = (player) => CancelSendMsg(player);