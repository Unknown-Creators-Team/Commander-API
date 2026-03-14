import { Player } from "@minecraft/server";
import { ActionFormBox } from "script-box-mc";
import { BasicConfigUI } from "./basic.js";
import { EventsConfigUI } from "./events.js";
import { ScriptEventsConfigUI } from "./scriptevents.js";
import config, { original } from "data/config.js";
import { OthersConfigUI } from "./others.js";
import { MessageFormBox } from "script-box-mc";
import { chalk } from "mc-chalk";

ActionFormBox.config.close.text = chalk.red.bold("閉じる");

export class ConfigUI {
    private player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    private async Main(status?: string) {
        const form = new ActionFormBox().title(chalk.bold("Commander API 設定"));
        if (status) form.body(status);
        form.button(chalk.bold("基本設定"), () => {
            if (config.updated) this.Main(chalk.red("設定が変更されています。") + chalk.netherite(" /reload ") + chalk.red("で再読み込みしてください。"));
            else BasicConfigUI.Open(this.player);
        })
            .button(chalk.bold("イベント設定"), () => {
                if (config.updated) this.Main(chalk.red("設定が変更されています。") + chalk.netherite(" /reload ") + chalk.red("で再読み込みしてください。"));
                else EventsConfigUI.Open(this.player);
            })
            .button(chalk.bold("§lスクリプトイベント設定"), () => {
                if (config.updated) this.Main(chalk.red("設定が変更されています。") + chalk.netherite(" /reload ") + chalk.red("で再読み込みしてください。"));
                else ScriptEventsConfigUI.Open(this.player);
            })
            .button(chalk.bold("§lその他各種設定"), () => {
                if (config.updated) this.Main(chalk.red("設定が変更されています。") + chalk.netherite(" /reload ") + chalk.red("で再読み込みしてください。"));
                else OthersConfigUI.Open(this.player);
            });

        if (config.format !== original.format) {
            form.button(chalk.bold.emerald("最新バージョンの設定に移行§r\n§7正しく移行できない可能性があります。"), () => {
                if (config.updated) this.Main(chalk.red("設定が変更されています。") + chalk.netherite(" /reload ") + chalk.red("で再読み込みしてください。"));
                else {
                    config.Migrate(config);
                    this.Main(chalk.yellow("設定を移行しました。") + chalk.gold(" /reload ") + chalk.yellow("で再読み込みしてください。"));
                }
            });
        }

        form.button(chalk.bold.red("設定を初期化"), () => {
            new MessageFormBox()
                .title(chalk.red.bold("【警告】設定を初期化"))
                .body("設定を初期化しますか？\nこの操作は元に戻せません。")
                .upperButton(chalk.red.bold("初期化"), () => {
                    config.Reset();
                    this.Main(chalk.yellow("設定を初期化しました。") + chalk.gold(" /reload ") + chalk.yellow("で再読み込みしてください。"));
                })
                .lowerButton(chalk.gray.bold("キャンセル"), () => this.Main(chalk.red("キャンセルされました。")))
                .show(this.player);
        });

        await form.show(this.player);
    }

    public static Open(player: Player, status?: string) {
        const ui = new ConfigUI(player);
        ui.Main(status);
    }
}
