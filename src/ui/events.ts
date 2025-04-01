import { Player } from "@minecraft/server";
import config, { original } from "data/config.js";
import { ModalFormBox } from "lib/ScriptBoxMC.js";
import { ConfigUI } from "./index.js";

export class EventsConfigUI {
    private player: Player;
    private config: typeof original;

    constructor(player: Player) {
        this.player = player;
        this.config = structuredClone(config);
    }

    private async Main() {
        const form = new ModalFormBox().title("§lCommander API 設定 / イベント設定");

        for (const [key, value] of Object.entries(config.events)) {
            form.label(`${key}${value.inline ? " (インライン)" : ""}`)
                .toggle("有効化", value.enabled, (_, enabled) => {
                    this.config.events[key as keyof typeof config.events].enabled = enabled;
                })
            if ("name" in value) {
                form.textField("イベント名", "ex: itemUse", value.name, (_, name) => {
                    (this.config.events[key as keyof typeof config.events] as any).name = name;
                });
            }
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
        const ui = new EventsConfigUI(player);
        ui.Main();
    }
}

function structuredClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}
