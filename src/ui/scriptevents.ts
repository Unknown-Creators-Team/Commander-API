import { Player } from "@minecraft/server";
import config, { original } from "data/config.js";
import { ModalFormBox } from "lib/ScriptBoxMC.js";
import { ConfigUI } from "./index.js";

export class ScriptEventsConfigUI {
    private player: Player;
    private config: typeof original;

    constructor(player: Player) {
        this.player = player;
        this.config = structuredClone(config);
    }

    private async Main() {
        const form = new ModalFormBox().title("§lCommander API 設定 / スクリプトイベント設定");

        for (const [key, value] of Object.entries(config.scriptevents)) {
            form.label(key)
                .toggle({
                    label: "有効化",
                    defaultValue: value.enabled,
                    callback: (_, enabled) => {
                        this.config.scriptevents[key as keyof typeof config.scriptevents].enabled = enabled;
                    },
                })
                .textField({
                    label: "イベント名",
                    placeholder: "ex: itemUse",
                    defaultValue: value.name,
                    callback: (_, name) => {
                        this.config.scriptevents[key as keyof typeof config.scriptevents].name = name;
                    },
                });
        }

        const res = await form.show(this.player);
        if (JSON.stringify(config) === JSON.stringify(this.config)) {
            ConfigUI.Open(this.player, "§7設定は変更されませんでした。");
        } else {
            config.Update(this.config);
            ConfigUI.Open(this.player, "§e設定を更新しました。§g/reload §eで再読み込みしてください。");
        }
    }

    public static Open(player: Player) {
        const ui = new ScriptEventsConfigUI(player);
        ui.Main();
    }
}

function structuredClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}
