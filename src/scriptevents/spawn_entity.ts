import { Block, Entity, world } from "@minecraft/server";
import * as v from "valibot";
import { SpawnEntitySchema } from "../schema.js";
import { parseFormat, parsePos } from "../utils.js";
import { Vec3 } from "@bedrock-oss/bedrock-boost";

export default function main(source: Entity | Block | undefined, message: string) {
    const parsed = parseFormat(message, source);
    const object = v.parse(SpawnEntitySchema, parsed);

    const location = Vec3.from(object.location?.map((v, i) => parsePos(v.toString(), source, (["x", "y", "z"] as const)[i])) ?? [0, 0, 0]);
    const dimension = source?.dimension ?? world.getDimension(object.dimension ?? "overworld");

    const entity = dimension.spawnEntity<string>(object.id, location);
    if (object.name) entity.nameTag = object.name;
    if (object.fire) entity.setOnFire(object.fire);
}
