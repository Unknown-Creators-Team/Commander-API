import { Block, Entity, ItemLockMode, ItemStack } from "@minecraft/server";
import * as v from "valibot";
import { SetItemSchema } from "../schema.js";
import { parseFormat } from "../utils.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot set item to a non-player entity.");

    const { container } = source;
    if (!container) throw new Error("Player does not have an inventory container.");

    const parsed = parseFormat(message, source);
    const object = v.parse(SetItemSchema, parsed);

    const amount = object.amount ?? 1;
    const item = new ItemStack(object.id, amount);
    const slot = object.slot ?? -1;

    if (object.name) item.nameTag = object.name;
    if (object.lore) item.setLore(object.lore);
    if (object.enchants) {
        const enchantments = item.enchantment;
        for (const { name, level } of object.enchants) {
            if (!name) continue;
            enchantments.addEnchant(name, level ?? 1);
        }
    }
    if (object.can_place_on) item.setCanPlaceOn(object.can_place_on);
    if (object.can_destroy) item.setCanDestroy(object.can_destroy);
    if (object.lock) item.lockMode = ItemLockMode[object.lock as keyof typeof ItemLockMode];
    if (object.keep_on_death) item.keepOnDeath = true;
    if (slot >= 0) container.setItem(slot, item);
    else container.addItem(item);
}
