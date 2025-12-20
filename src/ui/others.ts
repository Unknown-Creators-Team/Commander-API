import { Player, system } from "@minecraft/server";
import config, { original } from "data/config.js";
import { ModalFormBox } from "lib/ScriptBoxMC.js";
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
                }`
            )
            .toggle({
                label: "Extension 強制読み込み",
                defaultValue: config.others.extensions["Commander-API-Extension"].forceUse,
                callback: (_, value) => {
                    this.config.others.extensions["Commander-API-Extension"].forceUse = value;
                },
            })
            .toggle({
                label: "Screen 強制読み込み",
                defaultValue: config.others.extensions["Commander-API-Screen"].forceUse,
                callback: (_, value) => {
                    this.config.others.extensions["Commander-API-Screen"].forceUse = value;
                },
            });
        
        if (!config.events.playerLeave.enabled) {
            form.label("§cプレイヤー退出イベントを有効にしてください。§r\n§eイベント設定 → playerLeave → 有効");
        }

        form.label("退出メッセージ")
            .toggle({
                label: "有効",
                defaultValue: config.others.leave.enabled,
                callback: (_, value) => {
                    this.config.others.leave.enabled = value;
                },
            })
            .textField({
                label: "message",
                placeholder: "ex: {name} is gone...",
                defaultValue: config.others.leave.message,
                callback: (_, value) => {
                    this.config.others.leave.message = value;
                },
            });
        
        if (!config.events.chatSend.enabled) {
            form.label("§cチャット関連の設定を使用するには、チャット送信イベントを有効にしてください。§r\n§eイベント設定 → chatSend → 有効");
        }

        form.label("チャットのキャンセル")
            .toggle({
                label: "有効",
                defaultValue: config.others.cancelChat.enabled,
                callback: (_, value) => {
                    this.config.others.cancelChat.enabled = value;
                },
            })
            .textField({
                label: "正規表現パターン",
                placeholder: "ex: ^!.*",
                defaultValue: config.others.cancelChat.pattern,
                tooltip: "生成AIに書かせるか、「正規表現 チートシート」などで検索して、正規表現パターンを調べてください。",
                callback: (_, value) => {
                    this.config.others.cancelChat.pattern = value;
                },
            });
        
        form.label("カスタムチャット")
            .toggle({
                label: "有効",
                defaultValue: config.others.customChat.enabled,
                callback: (_, value) => {
                    this.config.others.customChat.enabled = value;
                },
            })
            .textField({
                label: "フォーマット",
                placeholder: "ex: <!name>: {message}",
                defaultValue: config.others.customChat.format,
                callback: (_, value) => {
                    this.config.others.customChat.format = value;
                },
            })
            .toggle({
                label: "WebSocket",
                defaultValue: config.others.customChat.websocket,
                tooltip: "WebSocketで拾えるようにtellrawで送信します。",
                callback: (_, value) => {
                    this.config.others.customChat.websocket = value;
                },
            });
        
        form.label("プライベートチャット")
            .toggle({
                label: "有効",
                defaultValue: config.others.privateChat.enabled,
                callback: (_, value) => {
                    this.config.others.privateChat.enabled = value;
                },
            })
            .textField({
                label: "フォーマット",
                placeholder: "ex: [Team {id}] <!name>: {message}",
                defaultValue: config.others.privateChat.format,
                callback: (_, value) => {
                    this.config.others.privateChat.format = value;
                },
            })
            .textField({
                label: "スコアボード名",
                placeholder: "ex: capi:private_chat",
                defaultValue: config.others.privateChat.objective,
                callback: (_, value) => {
                    this.config.others.privateChat.objective = value;
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
