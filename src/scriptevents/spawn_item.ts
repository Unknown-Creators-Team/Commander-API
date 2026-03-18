import { Block, Entity, ItemLockMode, ItemStack, world } from "@minecraft/server";
import * as v from "valibot";
import { SpawnItemSchema } from "../schema.js";
import { parseFormat, parsePos } from "../utils.js";
import { Vec3 } from "@bedrock-oss/bedrock-boost";

export default function main(source: Entity | Block | undefined, message: string) {
    const parsed = parseFormat(message, source);
    const object = v.parse(SpawnItemSchema, parsed);

    const location = Vec3.from(object.location?.map((v, i) => parsePos(v.toString(), source, (["x", "y", "z"] as const)[i])) ?? [0, 0, 0]);
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
