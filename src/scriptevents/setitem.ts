import { Block, Entity, ItemStack, ItemLockMode, EnchantmentType } from "@minecraft/server";
import { bothParse, setVariable } from "../util.js";


export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot set item to a non-player entity.");
    const container = source.getComponent("inventory")?.container;
    if (!container) throw new Error("Player does not have an inventory container.");

    const object: ItemObject = bothParse(message);
    if (!object.item) throw new Error("No item specified.");
    const amount = Number(object.amount ?? 1);
    const slot = object.slot !== undefined ? Number(object.slot) : false;
    const item = new ItemStack(object.item, amount);

    if (object.name) item.nameTag = setVariable(source, object.name) ?? object.name;
    if (object.lore) item.setLore(object.lore.map((line) => setVariable(source, line) ?? line));
    if (object.enchants) {
        const enchantments = item.getComponent("enchantable");
        for (const { name, level } of object.enchants) {
            if (!name) continue;
            enchantments?.addEnchantment({ type: new EnchantmentType(name), level: Number(level ?? 1)});
        }
    }
    if (object.can_place_on) item.setCanPlaceOn(object.can_place_on);
    if (object.can_destroy) item.setCanDestroy(object.can_destroy);
    if (object.lock) item.lockMode = ItemLockMode[object.lock as keyof typeof ItemLockMode];
    if (object.keep_on_death) item.keepOnDeath = object.keep_on_death == true ? true : false;
    if (typeof slot === "number") container.setItem(slot, item);
        else container.addItem(item);
}

interface ItemObject {
    item: string;
    name?: string;
    amount?: string | number;
    slot?: string | number;
    lore?: string[];
    enchants?: { name: string, level: string | number }[];
    can_place_on?: string[];
    can_destroy?: string[];
    lock?: ItemLockMode;
    keep_on_death?: string | boolean;
}