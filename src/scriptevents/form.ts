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

            object.btns.forEach((btn) => {
                if (!btn.txt) throw TypeError("Button text is required.");
                form.button(btn.txt, btn.img, () => {
                    if (btn.act) runAction(source, btn.act);
                });
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
            }
            if (object.btn2.text) {
                form.lowerButton(object.btn2.text, () => {
                    if (object.btn2.act) runAction(source, object.btn2.act);
                });
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
                    const label = content.label;
                    const options = content.options.map((v) => v).filter(Boolean);
                    form.dropdown(label, options, content.default, (_, res) => {
                        console.warn("res", res);
                        if (!content.action) return;
                        ScoreboardUtils.setScore(source, content.action, res);
                    });
                } else if (content.type === "slider") {
                    const label = content.label;
                    form.slider(
                        label,
                        Number(content.min),
                        Number(content.max),
                        Number(content.step),
                        content.default ? Number(content.default) : undefined
                    );
                } else if (content.type === "textField") {
                    const label = content.label;
                    form.textField(label, content.placeholder, content.default);
                } else if (content.type === "toggle") {
                    const label = content.label;
                    form.toggle(label, content.default);
                }
            });

            form.show(source).then((response) => {
                if (response.canceled) return;
                response.formValues?.forEach((value, key) => {
                    const data = object.content[key];
                    if (data.type === "dropdown") {
                        if (!data.action) return;
                        world.scoreboard.getObjective(data.action)?.setScore(source, value as number);
                    } else if (data.type === "slider") {
                        if (!data.action) return;
                        world.scoreboard.getObjective(data.action)?.setScore(source, value as number);
                    } else if (data.type === "textField") {
                        if (!data.action) return;
                        source.addTagWillRemove(`${data.action}:${value}`);
                    } else if (data.type === "toggle") {
                        if (!data.action) return;
                        world.scoreboard.getObjective(data.action)?.setScore(source, value as number);
                    }
                });
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
            text: string;
            act: actions | undefined;
        };
    }

    export interface Modal {
        type: "mdl" | "modal";
        title: string;
        content: contents[];
    }

    export type contents = dropdown | slider | textField | toggle;

    type dropdown = {
        type: "dd" | "dropdown";
        label: string;
        options: string[];
        default: number | undefined;
        action: string | undefined;
    };

    type slider = {
        type: "s" | "slider";
        label: string;
        min: number;
        max: number;
        step: number;
        default: number | undefined;
        action: string | undefined;
    };

    type textField = {
        type: "tf" | "textField";
        label: string;
        placeholder: string;
        default: string | undefined;
        action: string | undefined;
    };

    type toggle = {
        type: "t" | "toggle";
        label: string;
        default: boolean | undefined;
        action: string | undefined;
    };

    export type actions = addTag | removeTag | setScore | addScore | runCmd;

    type addTag = {
        type: "at" | "add_t" | "add_tag";
        value: string;
    };

    type removeTag = {
        type: "rt" | "rem_t" | "remove_tag";
        value: string;
    };

    type setScore = {
        type: "ss" | "set_s" | "set_score";
        value: {
            target: string | undefined;
            object: string;
            value: number;
        };
    };

    type addScore = {
        type: "as" | "add_s" | "add_score";
        value: {
            target: string | undefined;
            object: string;
            value: number;
        };
    };

    type runCmd = {
        type: "r" | "run" | "run_cmd" | "run_command";
        value: string;
    };
}
