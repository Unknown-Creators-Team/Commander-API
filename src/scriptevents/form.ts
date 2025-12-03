import { Block, Entity, Player, world } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { parseFormat } from "../util.js";
import { ActionFormBox } from "lib/ScriptBoxMC.js";
import { MessageFormBox } from "lib/ScriptBoxMC.js";
import { ModalFormBox } from "lib/ScriptBoxMC.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot use this script event in non-player entity.");
    const object = parseFormat<Form.Form>(message, source);
    object.type ??= "action";
    switch (object.type) {
        case "act":
        case "action": {
            const form = new ActionFormBox();
            if (object.title) form.title(object.title);
            if (object.body) form.body(object.body);

            object.btns.forEach((btn, i) => {
                if (!btn.txt) throw TypeError("Button text is required.");
                form.button(btn.txt, btn.img, () => {
                    if (btn.act) runAction(source, btn.act);
                    ScoreboardUtils.setScore(source, "capi:act_form", i + 1);
                });
            });

            form.show(source).then((response) => {
                if (response.canceled) return;
                source.addTagWillRemove(`form:${object.title}`);
            });

            break;
        }
        case "msg":
        case "message": {
            const form = new MessageFormBox();
            if (object.title) form.title(object.title);
            if (object.body) form.body(object.body);
            if (object.btn1.txt) {
                form.upperButton(object.btn1.txt, () => {
                    if (object.btn1.act) runAction(source, object.btn1.act);
                });
                ScoreboardUtils.setScore(source, "capi:msg_form", 1);
            }
            if (object.btn2.txt) {
                form.lowerButton(object.btn2.txt, () => {
                    if (object.btn2.act) runAction(source, object.btn2.act);
                });
                ScoreboardUtils.setScore(source, "capi:msg_form", 2);
            }

            form.show(source).then((response) => {
                if (response.canceled) return;
                source.addTagWillRemove(`form:${object.title}`);
            });
            break;
        }
        case "mdl":
        case "modal": {
            const form = new ModalFormBox();
            if (object.title) form.title(object.title);
            object.content.forEach((content) => {
                if (content.type === "dropdown" || content.type === "dd") {
                    if (!content.action) throw new Error("Action is required for dropdown.");
                    const options = content.options.map((v) => v).filter(Boolean);
                    form.dropdown({
                        label: content.label,
                        options: options,
                        defaultValueIndex: content.default,
                        callback: (_, res) => {
                            if (content.action === undefined) throw new Error("Action is required for dropdown.");
                            ScoreboardUtils.setScore(source, content.action, res);
                        },
                    });
                } else if (content.type === "slider" || content.type === "s") {
                    if (!content.action) throw new Error("Action is required for slider.");
                    form.slider({
                        label: content.label,
                        minimumValue: content.min,
                        maximumValue: content.max,
                        valueStep: content.step,
                        defaultValue: content.default,
                        callback: (_, res) => {
                            if (content.action === undefined) throw new Error("Action is required for slider.");
                            ScoreboardUtils.setScore(source, content.action, res);
                        },
                    });
                } else if (content.type === "textField" || content.type === "tf") {
                    if (!content.action) throw new Error("Action is required for textField.");
                    form.textField({
                        label: content.label,
                        placeholder: content.placeholder,
                        defaultValue: content.default,
                        callback: (_, res) => {
                            if (content.action === undefined) throw new Error("Action is required for textField.");
                            source.addTagWillRemove(`${content.action}:${res}`);
                        },
                    });
                } else if (content.type === "toggle" || content.type === "t") {
                    if (!content.action) throw new Error("Action is required for toggle.");
                    form.toggle({
                        label: content.label,
                        defaultValue: content.default,
                        callback: (_, res) => {
                            if (content.action === undefined) throw new Error("Action is required for toggle.");
                            ScoreboardUtils.setScore(source, content.action, res ? 1 : 0);
                        },
                    });
                }
            });

            form.show(source).then((response) => {
                if (response.canceled) return;
                source.addTagWillRemove(`form:${object.title}`);
            });
            break;
        }
    }
}

function runAction(source: Player, action: Form.actions) {
    switch (action.type) {
        case "at":
        case "add_t":
        case "add_tag": {
            source.addTag(action.value);
            break;
        }
        case "rt":
        case "rem_t":
        case "remove_tag": {
            source.removeTag(action.value);
            break;
        }
        case "ss":
        case "set_s":
        case "set_score": {
            const data = action.value;
            const object = data.object;
            const target = data.target ? data.target : source;
            const value = data.value;
            world.scoreboard.getObjective(object)?.setScore(target, value);
            break;
        }
        case "as":
        case "add_s":
        case "add_score": {
            const data = action.value;
            const object = data.object;
            const target = data.target ? data.target : source;
            const value = data.value;
            world.scoreboard.getObjective(object)?.addScore(target, value);
            break;
        }
        case "r":
        case "run":
        case "run_cmd":
        case "run_command": {
            const cmd = action.value;
            source.runCommand(cmd);
            break;
        }
    }
}

namespace Form {
    export type Form = Action | Message | Modal;

    export interface Action {
        type: "act" | "action";
        title: string;
        body: string;
        btns: {
            txt: string;
            img: string | undefined;
            act: actions | undefined;
        }[];
    }

    export interface Message {
        type: "msg" | "message";
        title: string;
        body: string;
        btn1: {
            txt: string;
            act: actions | undefined;
        };
        btn2: {
            txt: string;
            act: actions | undefined;
        };
    }

    export interface Modal {
        type: "mdl" | "modal";
        title: string;
        content: contents[];
    }

    export type contents = dropdown | slider | textField | toggle;

    interface dropdown {
        type: "dd" | "dropdown";
        label: string;
        options: string[];
        default: number | undefined;
        action: string | undefined;
    };

    interface slider {
        type: "s" | "slider";
        label: string;
        min: number;
        max: number;
        step: number;
        default: number | undefined;
        action: string | undefined;
    };

    interface textField {
        type: "tf" | "textField";
        label: string;
        placeholder: string;
        default: string | undefined;
        action: string | undefined;
    };

    interface toggle {
        type: "t" | "toggle";
        label: string;
        default: boolean | undefined;
        action: string | undefined;
    };

    export type actions = addTag | removeTag | setScore | addScore | runCmd;

    interface addTag {
        type: "at" | "add_t" | "add_tag";
        value: string;
    };

    interface removeTag {
        type: "rt" | "rem_t" | "remove_tag";
        value: string;
    };

    interface setScore {
        type: "ss" | "set_s" | "set_score";
        value: {
            target: string | undefined;
            object: string;
            value: number;
        };
    };

    interface addScore {
        type: "as" | "add_s" | "add_score";
        value: {
            target: string | undefined;
            object: string;
            value: number;
        };
    };

    interface runCmd {
        type: "r" | "run" | "run_cmd" | "run_command";
        value: string;
    };
}
