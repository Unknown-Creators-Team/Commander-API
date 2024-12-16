import { Block, Entity, Player, world } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { bothParse, format } from "../util.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot use this script event in non-player entity.");
    const object = bothParse(message);
    object.type ??= "action";
    switch (object.type) {
        case "action": {
            
            break;
        }
        case "message": {
            const is = (v: any): v is Form.Message => true;
            if (!is(object)) throw new Error("Invalid form object.");
            const form = new MessageFormData();
            if (object.title) form.title(format(source, object.title) ?? object.title);
            if (object.body) form.body(format(source, object.body) ?? object.body);
            if (object.button1.text) {
                const text = format(source, object.button1.text) ?? object.button1.text;
                form.button2(text);
            }
            if (object.button2.text) {
                const text = format(source, object.button2.text) ?? object.button2.text;
                form.button1(text);
            }

            form.show(source).then((response) => {
                if (response.canceled) return;
                if (response.selection === 1 && object.button1.action) runAction(source, object.button1.action);
                if (response.selection === 0 && object.button2.action) runAction(source, object.button2.action);
                source.addTagWillRemove(`form:${object.title}`);
            });
            break;
        }
        case "modal": {
            const is = (v: any): v is Form.Modal => true;
            if (!is(object)) throw new Error("Invalid form object.");
            const form = new ModalFormData();
            if (object.title) form.title(format(source, object.title) ?? object.title);
            object.content.forEach((content) => {
                if (content.type === "dropdown") {
                    const label = format(source, content.label) ?? content.label;
                    const options = content.options.map((v) => format(source, v) ?? v).filter(Boolean);
                    form.dropdown(label, options, content.default ? Number(content.default) : undefined);
                } else if (content.type === "slider") {
                    const label = format(source, content.label) ?? content.label;
                    form.slider(
                        label,
                        Number(content.min),
                        Number(content.max),
                        Number(content.step),
                        content.default ? Number(content.default) : undefined
                    );
                } else if (content.type === "textField") {
                    const label = format(source, content.label) ?? content.label;
                    form.textField(label, format(source, content.placeholder) ?? content.placeholder, content.default);
                } else if (content.type === "toggle") {
                    const label = format(source, content.label) ?? content.label;
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

function actionForm(source: Player, object: Form.Action) {
    const is = (v: any): v is Form.Action => true;
    if (!is(object)) throw new Error("Invalid form object.");
    const form = new ActionFormData();
    if (object.title) form.title(format(source, object.title) ?? object.title);
    if (object.body) form.body(format(source, object.body) ?? object.body);
    object.buttons.forEach((btn) => {
        if (!btn.text) throw TypeError("Button text is required.");
        const text = format(source, btn.text) ?? btn.text;
        if (btn.image) form.button(text, btn.image);
        else form.button(text);
    });

    form.show(source).then((response) => {
        if (response.canceled) return;
        console.warn("clicker");
        if (typeof response.selection === "number") {
            const { action } = object.buttons[response.selection];
            if (action) runAction(source, action);
        }
        console.warn(`form:${object.title}`);
        source.addTagWillRemove(`form:${object.title}`);
    });
}


function runAction (source: Player, action: Form.actions) {
    switch (action.type) {
        case "add_tag": {
            source.addTag(format(source, action.value) ?? action.value);
            break;
        }
        case "remove_tag": {
            source.removeTag(format(source, action.value) ?? action.value);
            break;
        }
        case "set_score": {
            const data = action.value;
            const object = data.object;
            const target = data.target ? format(source, data.target) ?? data.target : source;
            const value = data.value;
            world.scoreboard.getObjective(object)?.setScore(target, value);
            break;
        }
        case "add_score": {
            const data = action.value;
            const object = data.object;
            const target = data.target ? format(source, data.target) ?? data.target : source;
            const value = data.value;
            world.scoreboard.getObjective(object)?.addScore(target, value);
            break;
        }
        case "run_cmd": {
            const cmd = format(source, action.value) ?? action.value;
            source.runCommandAsync(cmd);
            break;
        }
    }
}

namespace Form {
    export interface Action {
        type: "action";
        title: string;
        body: string;
        buttons: {
            text: string;
            image?: string;
            action?: actions;
        }[];
    }

    export interface Message {
        type: "message";
        title: string;
        body: string;
        button1: {
            text: string;
            action?: actions;
        };
        button2: {
            text: string;
            action?: actions;
        };
    }

    export interface Modal {
        type: "modal";
        title: string;
        content: contents[];
    }

    export type contents = dropdown | slider | textField | toggle;

    type dropdown = {
        type: "dropdown";
        label: string;
        options: string[];
        default?: number;
        action?: string;
    }

    type slider = {
        type: "slider";
        label: string;
        min: number;
        max: number;
        step: number;
        default?: number;
        action?: string;
    }

    type textField = {
        type: "textField";
        label: string;
        placeholder: string;
        default?: string;
        action?: string;
    }

    type toggle = {
        type: "toggle";
        label: string;
        default?: boolean;
        action?: string;
    }

    export type actions = addTag | removeTag | setScore | addScore | runCmd;

    type addTag = {
        type: "add_tag";
        value: string;
    }

    type removeTag = {
        type: "remove_tag";
        value: string;
    }

    type setScore = {
        type: "set_score";
        value: {
            target?: string;
            object: string;
            value: number;
        }
    }

    type addScore = {
        type: "add_score";
        value: {
            target?: string;
            object: string;
            value: number;
        }
    }

    type runCmd = {
        type: "run_cmd";
        value: string;
    }
}