import { Player, system } from "@minecraft/server";
import config, { original } from "data/config.js";
import { ModalFormBox } from "script-box-mc";
import { ConfigUI } from "./index.js";

export class OthersConfigUI {
    private player: Player;
    private config: typeof original;

    constructor(player: Player) {
        this.player = player;
        this.config = structuredClone(config);
    }

    private async Main() {
        const form = new ModalFormBox().title("§lCommander API 設定 / その他各種設定").submitButton("設定を更新");

        const { isCapiExtensionLoaded, isCapiScreenLoaded } = system;

        form.label("拡張アドオン")
            .label(
                `Commander API Extension: ${isCapiExtensionLoaded ? "§a読み込み済み" : "§c未読み込み"}§r\nCommander API Screen: ${
                    isCapiScreenLoaded ? "§a読み込み済み" : "§c未読み込み"
                }`,
            )
            .toggle({
                label: "Extension 強制読み込み",
                defaultValue: config.others.extensions["Commander-API-Extension"].forceUse,
                callback: ({ response: res }) => {
                    this.config.others.extensions["Commander-API-Extension"].forceUse = res;
                },
            })
            .toggle({
                label: "Screen 強制読み込み",
                defaultValue: config.others.extensions["Commander-API-Screen"].forceUse,
                callback: ({ response: res }) => {
                    this.config.others.extensions["Commander-API-Screen"].forceUse = res;
                },
            });

        if (!config.events.playerLeave.enabled) {
            form.label("§cプレイヤー退出イベントを有効にしてください。§r\n§eイベント設定 → playerLeave → 有効");
        }

        form.label("退出メッセージ")
            .toggle({
                label: "有効",
                defaultValue: config.others.leave.enabled,
                callback: ({ response: res }) => {
                    this.config.others.leave.enabled = res;
                },
            })
            .textField({
                label: "message",
                placeholder: "ex: {name} is gone...",
                defaultValue: config.others.leave.message,
                callback: ({ response: res }) => {
                    this.config.others.leave.message = res;
                },
            });

        if (!config.events.chatSend.enabled) {
            form.label("§cチャット関連の設定を使用するには、チャット送信イベントを有効にしてください。§r\n§eイベント設定 → chatSend → 有効");
        }

        form.label("チャットのキャンセル (実験的)")
            .toggle({
                label: "有効",
                defaultValue: config.others.cancelChat.enabled,
                callback: ({ response: res }) => {
                    this.config.others.cancelChat.enabled = res;
                },
            })
            .textField({
                label: "正規表現パターン",
                placeholder: "ex: ^!.*",
                defaultValue: config.others.cancelChat.pattern,
                tooltip: "生成AIに書かせるか、「正規表現 チートシート」などで検索して、正規表現パターンを調べてください。",
                callback: ({ response: res }) => {
                    this.config.others.cancelChat.pattern = res;
                },
            });

        form.label("カスタムチャット")
            .toggle({
                label: "有効",
                defaultValue: config.others.customChat.enabled,
                callback: ({ response: res }) => {
                    this.config.others.customChat.enabled = res;
                },
            })
            .textField({
                label: "フォーマット",
                placeholder: "ex: <!name>: {message}",
                defaultValue: config.others.customChat.format,
                callback: ({ response: res }) => {
                    this.config.others.customChat.format = res;
                },
            })
            .toggle({
                label: "WebSocket",
                defaultValue: config.others.customChat.websocket,
                tooltip: "WebSocketで拾えるようにsayで送信します。必ずメッセージ内に '::' を入れて、'名前::メッセージ' の形式で送信してください。",
                callback: ({ response: res }) => {
                    this.config.others.customChat.websocket = res;
                },
            });

        form.label("プライベートチャット")
            .toggle({
                label: "有効",
                defaultValue: config.others.privateChat.enabled,
                callback: ({ response: res }) => {
                    this.config.others.privateChat.enabled = res;
                },
            })
            .textField({
                label: "フォーマット",
                placeholder: "ex: [Team {id}] <!name>: {message}",
                defaultValue: config.others.privateChat.format,
                callback: ({ response: res }) => {
                    this.config.others.privateChat.format = res;
                },
            })
            .textField({
                label: "スコアボード名",
                placeholder: "ex: capi:private_chat",
                defaultValue: config.others.privateChat.objective,
                callback: ({ response: res }) => {
                    this.config.others.privateChat.objective = res;
                },
            });

        const res = await form.show(this.player);
        if (JSON.stringify(config) === JSON.stringify(this.config)) {
            ConfigUI.Open(this.player, "§7設定は変更されませんでした。");
        } else {
            config.Update(this.config);
            ConfigUI.Open(this.player, "§e設定を更新しました。§g/reload §eで再読み込みしてください。");
        }
    }

    public static Open(player: Player) {
        const ui = new OthersConfigUI(player);
        ui.Main();
    }
}

function structuredClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}
