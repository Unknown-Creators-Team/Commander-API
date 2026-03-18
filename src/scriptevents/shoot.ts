import { Block, Entity, world } from "@minecraft/server";
import * as v from "valibot";
import { ShootSchema } from "../schema.js";
import { parseFormat, parsePos } from "../utils.js";
import { Vec3 } from "@bedrock-oss/bedrock-boost";

export default function main(source: Entity | Block | undefined, message: string) {
    const parsed = parseFormat(message, source);
    const object = v.parse(ShootSchema, parsed);

    const location = Vec3.from(object.location.map((v, i) => parsePos(v.toString(), source, (["x", "y", "z"] as const)[i])));
    const vector = Vec3.from(object.vector);
    const dimension = source?.dimension ?? world.getDimension(object.dimension ?? "overworld");
    const speed = object.speed ?? 1;

    if (isNaN(speed)) throw new Error("speed must be a number");
    if (speed <= 0) throw new Error("speed must be greater than 0");

    const entity = dimension.spawnEntity<string>(object.id, location);
    if (object.fire) entity.setOnFire(object.fire);
    if (object.nameTag) entity.nameTag = object.nameTag;

    entity.applyImpulse(vector.normalize().multiply(speed));
}
