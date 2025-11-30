import { Player } from "@minecraft/server";
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
                defaultValue: config.others.leave.message.toString(),
                callback: (_, value) => {
                    this.config.others.leave.message = value;
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
