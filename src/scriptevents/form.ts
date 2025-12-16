import { Block, Entity, Player, world } from "@minecraft/server";
import { ActionFormBox, MessageFormBox, ModalFormBox, ScoreboardUtils } from "lib/ScriptBoxMC.js";
import * as v from "lib/valibot.js";
import { FormSchema, type Form, type FormActions } from "../schema.js";
import { parseFormat } from "../utils.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot use this script event in non-player entity.");
    const parsed = parseFormat(message, source);

    // Validate with valibot and provide better error messages
    let object: Form;
    try {
        object = v.parse(FormSchema, parsed);
    } catch (error) {
        if (v.isValiError(error)) {
            // Build detailed error message
            const errorMessages: string[] = [];

            // Check what type of data we received
            if (!parsed || typeof parsed !== "object") {
                throw new Error("Form validation failed: Invalid input - expected an object");
            }

            // Check for type field to determine intended form type
            const typ = (parsed as any).typ;
            const formType = typ || "action";

            // Provide specific guidance based on form type
            if (formType === "act" || formType === "action") {
                const missing: string[] = [];
                if (!(parsed as any).ttl) missing.push("ttl (title)");
                if (!(parsed as any).btn) missing.push("btn (buttons array)");

                if (missing.length > 0) {
                    throw new Error(`Action Form validation failed: Missing required fields: ${missing.join(", ")}`);
                }
            } else if (formType === "msg" || formType === "message") {
                const missing: string[] = [];
                if (!(parsed as any).ttl) missing.push("ttl (title)");
                if (!(parsed as any).bdy) missing.push("bdy (body)");
                if (!(parsed as any).bt1) missing.push("bt1 (button1 object)");
                if (!(parsed as any).bt2) missing.push("bt2 (button2 object)");

                if (missing.length > 0) {
                    throw new Error(`Message Form validation failed: Missing required fields: ${missing.join(", ")}`);
                }
            } else if (formType === "mdl" || formType === "modal") {
                const missing: string[] = [];
                if (!(parsed as any).ttl) missing.push("ttl (title)");
                if (!(parsed as any).cnt) missing.push("cnt (content array)");

                if (missing.length > 0) {
                    throw new Error(`Modal Form validation failed: Missing required fields: ${missing.join(", ")}`);
                }
            }

            // Collect all validation errors for detailed output
            for (const issue of error.issues) {
                const path = issue.path?.map((p) => p.key).join(".") || "root";
                errorMessages.push(`${path}: ${issue.message}`);
            }

            throw new Error(`Form validation failed:\n${errorMessages.slice(0, 5).join("\n")}`);
        }
        throw error;
    }

    object.typ ??= "action";
    switch (object.typ) {
        case "act":
        case "action": {
            const form = new ActionFormBox();
            if (object.ttl) form.title(object.ttl);
            if (object.bdy) form.body(object.bdy);

            object.btn.forEach((btn: any, i: number) => {
                if (!btn.txt) throw TypeError("Button text is required.");
                form.button(btn.txt, btn.img, () => {
                    if (btn.act) runAction(source, btn.act);
                    ScoreboardUtils.setScore(source, "capi:act_form", i + 1);
                });
            });

            form.show(source).then((response) => {
                if (response.canceled) return;
                source.addTagWillRemove(`form:${object.ttl}`);
            });

            break;
        }
        case "msg":
        case "message": {
            const form = new MessageFormBox();
            if (object.ttl) form.title(object.ttl);
            if (object.bdy) form.body(object.bdy);
            if (object.bt1.txt) {
                form.upperButton(object.bt1.txt, () => {
                    if (object.bt1.act) runAction(source, object.bt1.act);
                });
                ScoreboardUtils.setScore(source, "capi:msg_form", 1);
            }
            if (object.bt2.txt) {
                form.lowerButton(object.bt2.txt, () => {
                    if (object.bt2.act) runAction(source, object.bt2.act);
                });
                ScoreboardUtils.setScore(source, "capi:msg_form", 2);
            }

            form.show(source).then((response) => {
                if (response.canceled) return;
                source.addTagWillRemove(`form:${object.ttl}`);
            });
            break;
        }
        case "mdl":
        case "modal": {
            const form = new ModalFormBox();
            if (object.ttl) form.title(object.ttl);
            object.cnt.forEach((content) => {
                if (content.typ === "dropdown" || content.typ === "dd") {
                    if (!content.act) throw new Error("Action is required for dropdown.");
                    const options = content.opt.filter(Boolean);
                    form.dropdown({
                        label: content.lbl,
                        options: options,
                        defaultValueIndex: content.def,
                        callback: (_, res) => {
                            if (content.act === undefined) throw new Error("Action is required for dropdown.");
                            ScoreboardUtils.setScore(source, content.act, res);
                        },
                    });
                } else if (content.typ === "slider" || content.typ === "s") {
                    if (!content.act) throw new Error("Action is required for slider.");
                    form.slider({
                        label: content.lbl,
                        minimumValue: content.min,
                        maximumValue: content.max,
                        valueStep: content.stp,
                        defaultValue: content.def,
                        callback: (_, res) => {
                            if (content.act === undefined) throw new Error("Action is required for slider.");
                            ScoreboardUtils.setScore(source, content.act, res);
                        },
                    });
                } else if (content.typ === "textField" || content.typ === "tf") {
                    if (!content.act) throw new Error("Action is required for textField.");
                    form.textField({
                        label: content.lbl,
                        placeholder: content.plh,
                        defaultValue: content.def,
                        callback: (_, res) => {
                            if (content.act === undefined) throw new Error("Action is required for textField.");
                            source.addTagWillRemove(`${content.act}:${res}`);
                        },
                    });
                } else if (content.typ === "toggle" || content.typ === "t") {
                    if (!content.act) throw new Error("Action is required for toggle.");
                    form.toggle({
                        label: content.lbl,
                        defaultValue: content.def,
                        callback: (_, res) => {
                            if (content.act === undefined) throw new Error("Action is required for toggle.");
                            ScoreboardUtils.setScore(source, content.act, res ? 1 : 0);
                        },
                    });
                }
            });

            form.show(source).then((response) => {
                if (response.canceled) return;
                source.addTagWillRemove(`form:${object.ttl}`);
            });
            break;
        }
    }
}

function runAction(source: Player, action: FormActions) {
    switch (action.typ) {
        case "at":
        case "add_t":
        case "add_tag": {
            source.addTag(action.val);
            break;
        }
        case "rt":
        case "rem_t":
        case "remove_tag": {
            source.removeTag(action.val);
            break;
        }
        case "ss":
        case "set_s":
        case "set_score": {
            const data = action.val;
            const object = data.obj;
            const target = data.tgt ? data.tgt : source;
            const value = data.val;
            world.scoreboard.getObjective(object)?.setScore(target, value);
            break;
        }
        case "as":
        case "add_s":
        case "add_score": {
            const data = action.val;
            const object = data.obj;
            const target = data.tgt ? data.tgt : source;
            const value = data.val;
            world.scoreboard.getObjective(object)?.addScore(target, value);
            break;
        }
        case "r":
        case "run":
        case "run_cmd":
        case "run_command": {
            const cmd = action.val;
            source.runCommand(cmd);
            break;
        }
    }
}
