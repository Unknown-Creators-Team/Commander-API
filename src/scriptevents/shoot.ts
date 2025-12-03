import { Block, Entity, Vector3, world } from "@minecraft/server";
import * as v from "lib/valibot.js";
import { format, bothParse, parsePos, parseFormat } from "../util.js";
import Vector from "lib/Vector.js";
import { ShootSchema, type Shoot } from "../schema.js";

export default function main(source: Entity | Block | undefined, message: string) {
    const parsed = parseFormat(message, source);
    const object = v.parse(ShootSchema, parsed);

    const location = Vector.fromArray(object.location.map((v, i) => parsePos(v.toString(), source, ["x", "y", "z"][i] as "x")));
    const vector = Vector.fromArray(object.vector);
    const dimension = source?.dimension ?? world.getDimension(object.dimension ?? "overworld");
    const speed = object.speed ?? 1;

    if (isNaN(speed)) throw new Error("speed must be a number");
    if (speed <= 0) throw new Error("speed must be greater than 0");

    const entity = dimension.spawnEntity<string>(object.id, location);
    if (object.fire) entity.setOnFire(object.fire);
    if (object.nameTag) entity.nameTag = object.nameTag;

    entity.applyImpulse(Vector.multiply(vector, speed));
}
