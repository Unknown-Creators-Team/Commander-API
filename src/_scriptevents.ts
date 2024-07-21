import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";
import { setVariable, easySafeParse, bothParse } from "./util";

const { world, system } = Minecraft;


system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { message, sourceEntity: player, sourceBlock: block } = event;
    const id = event.id.split(":").slice(1).join(":");

    const source = player as Minecraft.Player ?? block;

    if (!(source instanceof Minecraft.Player) && !block) return;

    world.sendMessage(`Received event ${id} from ${source instanceof Minecraft.Player ? source.name : "block"}: ${message}`);

    try {
        switch (id.toLowerCase()) {
            case "rename": {
                if (!source.isPlayer()) throw new Error("Cannot rename a non-player entity.");
                source.nameTag = setVariable(source, message) ?? message;
                break;
            }
            case "resetname":
            case "reset_name":
            case "reset": {
                if (!source.isPlayer()) throw new Error("Cannot rename a non-player entity.");
                source.nameTag = source.name;
                break;
            }
            case "setitem":
            case "set_item": {
                if (!source.isPlayer()) throw new Error("Cannot set item to a non-player entity.");
                const container = source.getComponent("inventory")?.container;
                if (!container) throw new Error("Player does not have an inventory container.");

                try {
                    const itemObject = bothParse(message);
                    if (!itemObject.item) return;
                    const amount = itemObject.amount ? Number(itemObject.amount) : 1;
                    const slot = itemObject.slot ? Number(itemObject.slot) : false;
                    const itemName = itemObject.item;//.replace("minecraft:", "");
                    const item = new Minecraft.ItemStack(itemName, amount);
                    if (itemObject.name) item.nameTag = setVariable(source, itemObject.name);
                    if (itemObject.lore) {
                        for (let v in itemObject.lore) itemObject.lore[v] = setVariable(source, itemObject.lore[v]);
                        item.setLore(itemObject.lore);
                    }
                    if (itemObject.enchants) {
                        const enchantments = item.getComponent("enchantable");
                        for (let i = 0; i < itemObject.enchants.length; i++) {
                            if (!itemObject.enchants[i].name) return;
                            let enchantsName = itemObject.enchants[i].name;
                            let enchantsLevel = 1;
                            if (itemObject.enchants[i].level) enchantsLevel = Number(itemObject.enchants[i].level);
                            enchantments?.addEnchantment({ "type": enchantsName, "level": enchantsLevel });
                        }
                    }
                    if (itemObject.can_place_on) item.setCanPlaceOn(itemObject.can_place_on);
                    if (itemObject.can_destroy) item.setCanDestroy(itemObject.can_destroy);
                    if (itemObject.lock) item.lockMode = Minecraft.ItemLockMode[itemObject.lock as keyof typeof Minecraft.ItemLockMode];
                    if (itemObject.keep_on_death) item.keepOnDeath = itemObject.keep_on_death === "true" ? true : false;
                    if (typeof slot == "number") container.setItem(slot, item);
                    else container.addItem(item);
                } catch (e) {
                    console.error(e, (e as Error).stack);
                    source.sendMessage(`§c${e}`);
                    for (const ply of world.getPlayers({ tags: ["Capi:hasOp"] })) ply.sendMessage(`§c${e}`);
                }
                break;
            }
            case "form": {
                const object = bothParse(message);
                object.type ??= "action";
                switch (object.type) {
                    case "action": {
                        const is = (v: any): v is Form.Action => true;
                        if (!is(object)) throw new Error("Invalid form object.");
                        const form = new MinecraftUI.ActionFormData();
                        if (object.title) form.title(setVariable(source, object.title) ?? object.title);
                        if (object.body) form.body(setVariable(source, object.body) ?? object.body);
                        object.buttons.forEach((btn) => {
                            if (!btn.text) throw TypeError("Button text is required.");
                            const text = setVariable(source, btn.text) ?? btn.text;
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
                        break;
                    }
                    case "message": {
                        const is = (v: any): v is Form.Message => true;
                        if (!is(object)) throw new Error("Invalid form object.");
                        const form = new MinecraftUI.MessageFormData();
                        if (object.title) form.title(setVariable(source, object.title) ?? object.title);
                        if (object.body) form.body(setVariable(source, object.body) ?? object.body);
                        if (object.button1.text) {
                            const text = setVariable(source, object.button1.text) ?? object.button1.text;
                            form.button2(text);
                        }
                        if (object.button2.text) {
                            const text = setVariable(source, object.button2.text) ?? object.button2.text;
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
                        const form = new MinecraftUI.ModalFormData();
                        if (object.title) form.title(setVariable(source, object.title) ?? object.title);
                        object.content.forEach((content) => {
                            if (content.type === "dropdown") {
                                const label = setVariable(source, content.label) ?? content.label;
                                const options = content.options.map((v) => setVariable(source, v) ?? v).filter(Boolean);
                                form.dropdown(label, options, content.default ? Number(content.default) : undefined);
                            } else if (content.type === "slider") {
                                const label = setVariable(source, content.label) ?? content.label;
                                form.slider(label, Number(content.min), Number(content.max), Number(content.step), content.default ? Number(content.default) : undefined);
                            } else if (content.type === "textField") {
                                const label = setVariable(source, content.label) ?? content.label;
                                form.textField(label, setVariable(source, content.placeholder) ?? content.placeholder, content.default);
                            } else if (content.type === "toggle") {
                                const label = setVariable(source, content.label) ?? content.label;
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
                            })
                            source.addTagWillRemove(`form:${object.title}`);
                        });
                        break;
                    }
                }
                break;
            }
        }
    } catch (e) {
        console.error(e, (e as Error).stack);
        if (source.isPlayer()) source.sendMessage(`§c${e}`);
        for (const ply of world.getPlayers({ tags: ["Capi:hasOp"] })) ply.sendMessage(`§c${e}`);
    }
    
}, { namespaces: ["capi", "Capi", "cApi", "CApi", "c-api", "C-api"] });

function runAction (source: Minecraft.Player, action: Form.actions) {
    switch (action.type) {
        case "add_tag": {
            source.addTag(setVariable(source, action.value) ?? action.value);
            break;
        }
        case "remove_tag": {
            source.removeTag(setVariable(source, action.value) ?? action.value);
            break;
        }
        case "set_score": {
            const data = action.value;
            const object = data.object;
            const target = data.target ? setVariable(source, data.target) ?? data.target : source;
            const value = data.value;
            world.scoreboard.getObjective(object)?.setScore(target, value);
            break;
        }
        case "add_score": {
            const data = action.value;
            const object = data.object;
            const target = data.target ? setVariable(source, data.target) ?? data.target : source;
            const value = data.value;
            world.scoreboard.getObjective(object)?.addScore(target, value);
            break;
        }
        case "run_cmd": {
            const cmd = setVariable(source, action.value) ?? action.value;
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