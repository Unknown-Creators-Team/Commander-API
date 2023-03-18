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
    .button("§l§c閉じる")
    .show(player).then(response => {
        if (response.selection === 0) LeaveMsg(player);
        if (response.selection === 1) ChatUI(player);
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