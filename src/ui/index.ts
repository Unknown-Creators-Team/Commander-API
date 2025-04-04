import { Player } from "@minecraft/server";
import { ActionFormBox } from "lib/ScriptBoxMC.js";
import { BasicConfigUI } from "./basic.js";
import { EventsConfigUI } from "./events.js";
import { ScriptEventsConfigUI } from "./scriptevents.js";
import config, { original } from "data/config.js";
import { OthersConfigUI } from "./others.js";
import { MessageFormBox } from "lib/ScriptBoxMC.js";

export class ConfigUI {
    private player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    private async Main(status?: string) {
        const form = new ActionFormBox().title("§lCommander API 設定");
        if (status) form.body(status);
        form.button("§l基本設定", undefined, () => {
            if (config.updated) this.Main("§c設定が変更されています。§m/reload §cで再読み込みしてください。");
            else BasicConfigUI.Open(this.player);
        })
            .button("§lイベント設定", undefined, () => {
                if (config.updated) this.Main("§c設定が変更されています。§m/reload §cで再読み込みしてください。");
                else EventsConfigUI.Open(this.player);
            })
            .button("§lスクリプトイベント設定", undefined, () => {
                if (config.updated) this.Main("§c設定が変更されています。§m/reload §cで再読み込みしてください。");
                else ScriptEventsConfigUI.Open(this.player);
            })
            .button("§lその他各種設定", undefined, () => {
                if (config.updated) this.Main("§c設定が変更されています。§m/reload §cで再読み込みしてください。");
                else OthersConfigUI.Open(this.player);
            });
        
        if (config.format !== original.format) {
            form.button("§l§p最新バージョンの設定に移行§r\n§7正しく移行できない可能性があります。", undefined, () => {
                if (config.updated) this.Main("§c設定が変更されています。§m/reload §cで再読み込みしてください。");
                else {
                    config.Migrate(config);
                    this.Main("§e設定を移行しました。§g/reload §eで再読み込みしてください。");
                }
            });
        }

        form.button("§l§c設定を初期化", undefined, () => {
            new MessageFormBox()
                .title("§l§c【警告】設定を初期化")
                .body("設定を初期化しますか？\nこの操作は元に戻せません。")
                .upperButton("§l§c初期化", () => {
                    config.Reset();
                    this.Main("§e設定を初期化しました。§g/reload §eで再読み込みしてください。");
                })
                .lowerButton("§l§8キャンセル", () => this.Main("§cキャンセルされました。"))
                .show(this.player);
        });

        await form.show(this.player);
    }

    public static Open(player: Player, status?: string) {
        const ui = new ConfigUI(player);
        ui.Main(status);
    }
}
