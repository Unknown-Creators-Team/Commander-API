import { Block, Entity, ItemStack, ItemLockMode, EnchantmentType, world } from "@minecraft/server";
import { bothParse, parsePos, format, parseFormat } from "../util.js";
import Vector from "lib/Vector.js";


export default function main(source: Entity | Block | undefined, message: string) {
    // const object: ItemObject = bothParse(message);
    // if (!object.item) throw new Error("No item specified.");
    // const amount = Number(object.amount ?? 1);
    // const item = new ItemStack(object.item, amount);

    // if (object.name) item.nameTag = format(source, object.name) ?? object.name;
    // if (object.lore) item.setLore(object.lore.map((line) => format(source, line) ?? line));
    // if (object.enchants) {
    //     const enchantments = item.getComponent("enchantable");
    //     for (const { name, level } of object.enchants) {
    //         if (!name) continue;
    //         enchantments?.addEnchantment({ type: new EnchantmentType(name), level: Number(level ?? 1)});
    //     }
    // }
    // if (object.can_place_on) item.setCanPlaceOn(object.can_place_on);
    // if (object.can_destroy) item.setCanDestroy(object.can_destroy);
    // if (object.lock) item.lockMode = ItemLockMode[object.lock as keyof typeof ItemLockMode];
    // if (object.keep_on_death) item.keepOnDeath = object.keep_on_death == true ? true : false;
    
    // const x = typeof object.x === "string" ? parsePos(object.x, source, "x") : object.x ?? source?.location.x ?? 0;
    // const y = typeof object.y === "string" ? parsePos(object.y, source, "y") : object.y ?? source?.location.y ?? 0;
    // const z = typeof object.z === "string" ? parsePos(object.z, source, "z") : object.z ?? source?.location.z ?? 0;
    // const location = { x, y, z };
    // const dimension = object.dimension ?? source?.dimension.id ?? "overworld";

    // world.getDimension(dimension).spawnItem(item, location);

    const object = parseFormat<SpawnItem>(message, source);
    if (object === undefined) throw new Error("Invalid format");

    if (object.item === undefined) throw new Error("item is required");

    const location = Vector.fromArray(object.location?.map((v, i) => parsePos(v.toString(), source, ["x", "y", "z"][i] as "x")) ?? [0, 0, 0]);
    const dimension = source?.dimension ?? world.getDimension(object.dimension ?? "overworld");
    const amount = object.amount ?? 1;
    const item = new ItemStack(object.item, amount);
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

    const entity = dimension.spawnItem(item, location);
    if (object.clear_velocity) entity.clearVelocity();
}

interface SpawnItem {
    item: string;
    name: string | undefined;
    amount: number | undefined;
    lore: string[] | undefined;
    enchants: { name: string, level: number | undefined }[] | undefined;
    can_place_on: string[] | undefined;
    can_destroy: string[] | undefined;
    lock: ItemLockMode | undefined;
    keep_on_death: boolean | undefined;
    location: [number | string, number | string, number | string] | undefined;
    dimension: string | undefined;
    clear_velocity: boolean | undefined;
}