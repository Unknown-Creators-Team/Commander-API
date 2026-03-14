import { Player } from "@minecraft/server";
import config, { original } from "data/config.js";
import { ModalFormBox } from "script-box-mc";
import { ConfigUI } from "./index.js";

export class BasicConfigUI {
    private player: Player;
    private config: typeof original;

    constructor(player: Player) {
        this.player = player;
        this.config = structuredClone(config);
    }

    private async Main() {
        const form = new ModalFormBox().title("§lCommander API 設定 / 基本設定").submitButton("設定を更新");

        form.label("タグを自動で削除")
            .toggle({
                label: "有効",
                defaultValue: config.basic.tag.enabled,
                callback: ({ response: res }) => {
                    this.config.basic.tag.enabled = res;
                },
            })
            .textField({
                label: "ticks",
                placeholder: "ex: 10",
                defaultValue: config.basic.tag.ticks.toString(),
                callback: ({ response: res }) => {
                    this.config.basic.tag.ticks = parseInt(res);
                },
            });

        form.label("デバッグ")
            .toggle({
                label: "有効",
                defaultValue: config.basic.debug.enabled,
                callback: ({ response: res }) => {
                    this.config.basic.debug.enabled = res;
                },
            })
            .toggle({
                label: "ログを表示",
                defaultValue: config.basic.debug.log,
                callback: ({ response: res }) => {
                    this.config.basic.debug.log = res;
                },
            })
            .toggle({
                label: "情報を表示",
                defaultValue: config.basic.debug.info,
                callback: ({ response: res }) => {
                    this.config.basic.debug.info = res;
                },
            })
            .toggle({
                label: "警告を表示",
                defaultValue: config.basic.debug.warn,
                callback: ({ response: res }) => {
                    this.config.basic.debug.warn = res;
                },
            })
            .toggle({
                label: "エラーを表示",
                defaultValue: config.basic.debug.error,
                callback: ({ response: res }) => {
                    this.config.basic.debug.error = res;
                },
            });

        form.label("テスト")
            .toggle({
                label: "有効",
                defaultValue: config.basic.tests.enabled,
                tooltip: "テストはデバッグやトラブルシューティングに使用します。必ずドキュメントに従って使用してください。",
                callback: ({ response: res }) => {
                    this.config.basic.tests.enabled = res;
                },
            })
            .toggle({
                label: "events",
                defaultValue: config.basic.tests.events,
                callback: ({ response: res }) => {
                    this.config.basic.tests.events = res;
                },
            })
            .toggle({
                label: "scriptevents",
                defaultValue: config.basic.tests.scriptevents,
                callback: ({ response: res }) => {
                    this.config.basic.tests.scriptevents = res;
                },
            });

        await form.show(this.player);
        if (JSON.stringify(config) === JSON.stringify(this.config)) {
            ConfigUI.Open(this.player, "§7設定は変更されませんでした。");
        } else {
            config.Update(this.config);
            ConfigUI.Open(this.player, "§e設定を更新しました。§g/reload §eで再読み込みしてください。");
        }
    }

    public static Open(player: Player) {
        const ui = new BasicConfigUI(player);
        ui.Main();
    }
}

function structuredClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}
