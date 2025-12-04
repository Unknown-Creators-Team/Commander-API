import { Block, Entity } from "@minecraft/server";
import config from "data/config.js";
import { ItemStackUtils } from "lib/ScriptBoxMC.js";
import * as v from "lib/valibot.js";
import { parseFormat, removeTagsStartsWith } from "util.js";
import { GetItemSchema } from "../schema.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot run command as a non-player entity.");

    const parsed = parseFormat(message, source);
    const object = v.parse(GetItemSchema, parsed);
    object.slot ??= source.selectedSlotIndex;
    object.minimize ??= true;

    const item = source.container?.getItem(object.slot);
    if (!item) throw new Error("Item not found in the specified slot.");

    const json = object.minimize ? ItemStackUtils.minimizeJSON(ItemStackUtils.toJSON(item)) : ItemStackUtils.toJSON(item);
    if (!json) throw new Error("Failed to convert item stack to JSON.");

    removeTagsStartsWith(source, `capi:${config.scriptevents.get_item.name}.`);

    source.addTagWillRemove(`capi:${config.scriptevents.get_item.name}`);

    for (const [key, value] of Object.entries(decode(json))) {
        const text = `${config.scriptevents.get_item.name}.${key}:${value?.toString()}`;
        source.addTag(text);
        source.addTagWillRemove(text);
        console.log(text);
    }
}

// from src/data/config.ts
function decode<T extends string | number | boolean | symbol | undefined>(obj: any, parent = ""): Record<string, T> {
    return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        const path = parent ? `${parent}.${key}` : key;
        if (typeof value === "object") {
            return { ...acc, ...decode(value, path) };
        }
        return { ...acc, [path]: value };
    }, {});
}
