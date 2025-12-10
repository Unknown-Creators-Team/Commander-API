import { Player } from "@minecraft/server";
import config, { original } from "data/config.js";
import { ModalFormBox } from "lib/ScriptBoxMC.js";
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
                callback: (_, value, all) => {
                    this.config.basic.tag.enabled = value;
                },
            })
            .textField({
                label: "ticks",
                placeholder: "ex: 10",
                defaultValue: config.basic.tag.ticks.toString(),
                callback: (_, value) => {
                    this.config.basic.tag.ticks = parseInt(value);
                },
            });

        form.label("デバッグ")
            .toggle({
                label: "有効",
                defaultValue: config.basic.debug.enabled,
                callback: (_, value) => {
                    this.config.basic.debug.enabled = value;
                },
            })
            .toggle({
                label: "ログを表示",
                defaultValue: config.basic.debug.log,
                callback: (_, value) => {
                    this.config.basic.debug.log = value;
                },
            })
            .toggle({
                label: "情報を表示",
                defaultValue: config.basic.debug.info,
                callback: (_, value) => {
                    this.config.basic.debug.info = value;
                },
            })
            .toggle({
                label: "警告を表示",
                defaultValue: config.basic.debug.warn,
                callback: (_, value) => {
                    this.config.basic.debug.warn = value;
                },
            })
            .toggle({
                label: "エラーを表示",
                defaultValue: config.basic.debug.error,
                callback: (_, value) => {
                    this.config.basic.debug.error = value;
                },
            });
        
        form.label("テスト")
            .toggle({
                label: "有効",
                defaultValue: config.basic.tests.enabled,
                tooltip: "テストはデバッグやトラブルシューティングに使用します。必ずドキュメントに従って使用してください。",
                callback: (_, value) => {
                    this.config.basic.tests.enabled = value;
                },
            })
            .toggle({
                label: "events",
                defaultValue: config.basic.tests.events,
                callback: (_, value) => {
                    this.config.basic.tests.events = value;
                },
            })
            .toggle({
                label: "scriptevents",
                defaultValue: config.basic.tests.scriptevents,
                callback: (_, value) => {
                    this.config.basic.tests.scriptevents = value;
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
        const ui = new BasicConfigUI(player);
        ui.Main();
    }
}

function structuredClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}
