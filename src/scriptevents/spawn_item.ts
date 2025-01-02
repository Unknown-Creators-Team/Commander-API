import { Block, Entity, ItemStack, ItemLockMode, EnchantmentType, world } from "@minecraft/server";
import { bothParse, parsePos, format } from "../util.js";


export default function main(source: Entity | Block | undefined, message: string) {
    const object: ItemObject = bothParse(message);
    if (!object.item) throw new Error("No item specified.");
    const amount = Number(object.amount ?? 1);
    const item = new ItemStack(object.item, amount);

    if (object.name) item.nameTag = format(source, object.name) ?? object.name;
    if (object.lore) item.setLore(object.lore.map((line) => format(source, line) ?? line));
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
    
    const x = typeof object.x === "string" ? parsePos(object.x, source, "x") : object.x ?? source?.location.x ?? 0;
    const y = typeof object.y === "string" ? parsePos(object.y, source, "y") : object.y ?? source?.location.y ?? 0;
    const z = typeof object.z === "string" ? parsePos(object.z, source, "z") : object.z ?? source?.location.z ?? 0;
    const location = { x, y, z };
    const dimension = object.dimension ?? source?.dimension.id ?? "overworld";

    world.getDimension(dimension).spawnItem(item, location);
}

interface ItemObject {
    item: string;
    name?: string;
    amount?: string | number;
    lore?: string[];
    enchants?: { name: string, level: string | number }[];
    can_place_on?: string[];
    can_destroy?: string[];
    lock?: ItemLockMode;
    keep_on_death?: string | boolean;
    x?: string | number;
    y?: string | number;
    z?: string | number;
    dimension?: string;
}