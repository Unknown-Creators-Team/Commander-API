import { Player } from "@minecraft/server";
import { MessageFormBox, ModalFormBox } from "script-box-mc";
import { ActionFormBox } from "script-box-mc";
import { ScoreboardDatabase } from "lib/DatabaseMC.js";
import { uiManager, UIManager } from "@minecraft/server-ui";

export class CallsUI {
    private player: Player;
    private calls = new ScoreboardDatabase<string, string[]>("CAPI_CALLS");
    private call: Call = { name: "", commands: [] };

    constructor(player: Player) {
        this.player = player;
    }

    private async Main() {
        const form = new ActionFormBox().title("§lCommander API Calls");

        form.button("§lコールを追加", () => {
            this.AddCall();
        });

        this.calls.forEach((commands, name) => {
            form.button(`${name}\n${commands.length}つのコマンド`, () => {
                this.call = { name, commands };
                this.EditCall(name);
            });
        });

        form.button("§l§cコールを全て削除", () => {
            this.DeleteAllCalls();
        });

        await form.show(this.player);
    }

    private async AddCall(err?: string) {
        const form = new ModalFormBox().title("§lCommander API / コールを追加").submitButton("§l追加");
        if (err) form.label(err);

        form.textField({
            label: "コール名",
            placeholder: "ex: my_call",
            defaultValue: this.call.name,
            callback: ({ response: res }) => {
                this.call.name = res;
            },
        });

        for (let i in this.call.commands) {
            form.textField({
                label: `コマンド (${Number(i) + 1})`,
                placeholder: "ex: say hello",
                defaultValue: this.call.commands[i],
                callback: ({ response: res }) => {
                    this.call.commands[i] = res;
                },
            });
        }

        form.toggle({
            label: "コマンドを追加",
            defaultValue: false,
            callback: ({ response: res }) => {
                if (res) {
                    this.call.commands.push("");
                    this.AddCall();
                } else {
                    let err = this.checkCall();
                    if (err) return this.AddCall(err);

                    this.call.commands = this.call.commands.map((v) => ((v = v.trim()), v.startsWith("/") ? v.slice(1) : v)).filter(Boolean);
                    this.calls.set(this.call.name, this.call.commands);
                    CallsUI.Open(this.player);
                }
            },
        });

        form.cancel((player) => CallsUI.Open(player));
        await form.show(this.player);
    }

    private async EditCall(oldName: string, err?: string) {
        const form = new ModalFormBox().title("§lCommander API / コールを編集").submitButton("§l更新");
        if (err) form.label(err);

        form.textField({
            label: "コール名",
            placeholder: "ex: my_call",
            defaultValue: this.call.name,
            callback: ({ response: res }) => {
                this.call.name = res;
            },
        });

        for (let i in this.call.commands) {
            form.textField({
                label: `コマンド (${Number(i) + 1})`,
                placeholder: "ex: say hello",
                defaultValue: this.call.commands[i],
                callback: ({ response: res }) => {
                    this.call.commands[i] = res;
                },
            });
        }

        form.toggle({
            label: "コマンドを追加",
            defaultValue: false,
            callback: ({ response: res, responses }) => {
                console.log(responses[responses.length - 1]);
                if (responses[responses.length - 1] === true) return;

                if (res) {
                    this.call.commands.push("");
                    this.EditCall(oldName);
                } else {
                    let err = this.checkCall(false);
                    if (err) return this.EditCall(oldName, err);

                    this.calls.delete(oldName);
                    this.calls.set(this.call.name, this.call.commands);
                    CallsUI.Open(this.player);
                }
            },
        });

        form.toggle({
            label: "コールを削除",
            defaultValue: false,
            callback: ({ response: res }) => {
                if (res) {
                    this.calls.delete(this.call.name);
                    uiManager.closeAllForms(this.player);
                    CallsUI.Open(this.player);
                }
            },
        });

        form.cancel((player) => CallsUI.Open(player));
        await form.show(this.player);
    }

    private async DeleteAllCalls() {
        const form = new MessageFormBox()
            .title("§lCommander API / 全てのコールを削除")
            .body("全てのコールを削除しますか？\nこの操作は元に戻せません。")
            .upperButton("§l§c全て削除", () => {
                this.calls.clear();
                CallsUI.Open(this.player);
            })
            .lowerButton("§l§8キャンセル", () => {
                CallsUI.Open(this.player);
            });
        await form.show(this.player);
    }

    private checkCall(strict = true): string | undefined {
        if (this.call.name.match(/[^a-zA-Z0-9_]/)) {
            return "§cコール名は英数字とアンダースコアのみ使用できます。";
        }
        if (!this.call.name) {
            return "§cコール名は必須です。";
        }
        if (this.call.name.length > 16) {
            return "§cコール名は16文字以内で指定してください。";
        }
        if (strict && this.calls.has(this.call.name)) {
            return "§cこのコール名は既に使用されています。";
        }

        this.call.commands = this.call.commands.map((v) => ((v = v.trim()), v.startsWith("/") ? v.slice(1) : v)).filter(Boolean);

        if (this.call.commands.length === 0) {
            return "§cコマンドは必須です。";
        }
    }

    public static Open(player: Player) {
        const ui = new CallsUI(player);
        ui.Main();
    }
}

interface Call {
    name: string;
    commands: string[];
}
