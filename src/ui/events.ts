import { Player } from "@minecraft/server";
import config, { original } from "data/config.js";
import { ModalFormBox } from "script-box-mc";
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
            form.label(`${key}${value.inline ? " (インライン)" : ""}`).toggle({
                label: "有効化",
                defaultValue: value.enabled,
                callback: ({ response: res }) => {
                    this.config.events[key as keyof typeof config.events].enabled = res;
                },
            });
            if ("name" in value) {
                form.textField({
                    label: "イベント名",
                    placeholder: "ex: itemUse",
                    defaultValue: value.name,
                    callback: ({ response: res }) => {
                        (this.config.events[key as keyof typeof config.events] as any).name = res;
                    },
                });
            }
            if ("options" in value) {
                form.slider({
                    label: "最大距離",
                    minimumValue: 5,
                    maximumValue: 150,
                    defaultValue: value.options.maxDistance,
                    valueStep: 5,
                    callback: ({ response: res }) => {
                        (this.config.events[key as keyof typeof config.events] as any).options.maxDistance = res;
                    },
                });

                form.toggle({
                    label: "液体ブロック(水や溶岩)の検知",
                    defaultValue: value.options.includeLiquidBlocks,
                    callback: ({ response: res }) => {
                        (this.config.events[key as keyof typeof config.events] as any).options.includeLiquidBlocks = res;
                    },
                });

                form.toggle({
                    label: "通過可能ブロック(つるや花)の検知",
                    defaultValue: value.options.includePassableBlocks,
                    callback: ({ response: res }) => {
                        (this.config.events[key as keyof typeof config.events] as any).options.includePassableBlocks = res;
                    },
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
