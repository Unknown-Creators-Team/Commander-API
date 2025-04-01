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
            .toggle("有効", config.basic.tag.enabled, (_, value) => {
                this.config.basic.tag.enabled = value;
            })
            .textField("ticks", "ex: 10", config.basic.tag.ticks.toString(), (_, value) => {
                this.config.basic.tag.ticks = parseInt(value);
            });

        form.label("デバッグ")
            .toggle("有効", config.basic.debug.enabled, (_, value) => {
                this.config.basic.debug.enabled = value;
            })
            .toggle("ログを表示", config.basic.debug.log, (_, value) => {
                this.config.basic.debug.log = value;
            })
            .toggle("情報を表示", config.basic.debug.info, (_, value) => {
                this.config.basic.debug.info = value;
            })
            .toggle("警告を表示", config.basic.debug.warn, (_, value) => {
                this.config.basic.debug.warn = value;
            })
            .toggle("エラーを表示", config.basic.debug.error, (_, value) => {
                this.config.basic.debug.error = value;
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
