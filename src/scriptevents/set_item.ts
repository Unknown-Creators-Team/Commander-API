import { Block, Entity, ItemStack, ItemLockMode, EnchantmentType } from "@minecraft/server";
import { bothParse, format, parseFormat } from "../util.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot set item to a non-player entity.");

    const { container } = source;
    if (!container) throw new Error("Player does not have an inventory container.");

    const object = parseFormat<ItemObject>(message, source);
    if (object === undefined) throw new Error("Invalid format");
    if (object.id === undefined) throw new Error("id is required");

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

interface ItemObject {
    id: string;
    name: string | undefined;
    amount: number | undefined;
    slot: number | undefined;
    lore: string[] | undefined;
    enchants: { name: string; level: number | undefined }[] | undefined;
    can_place_on: string[] | undefined;
    can_destroy: string[] | undefined;
    lock: ItemLockMode | undefined;
    keep_on_death: boolean | undefined;
}
