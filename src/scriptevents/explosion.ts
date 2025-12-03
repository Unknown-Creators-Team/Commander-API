import { Block, Entity, ExplosionOptions, world } from "@minecraft/server";
import * as v from "lib/valibot.js";
import { parsePos, parseFormat } from "../util.js";
import Vector from "lib/Vector.js";
import { ExplosionSchema, type Explosion } from "../schema.js";

export default function main(source: Entity | Block | undefined, message: string) {
    const parsed = parseFormat(message, source);
    const object = v.parse(ExplosionSchema, parsed);

    object.location ??= source ? (Object.values(source.location) as any) : [0, 0, 0];

    const radius = object.radius;
    const location = Vector.fromArray(object.location?.map((v, i) => parsePos(v.toString(), source, ["x", "y", "z"][i] as "x")) ?? [0, 0, 0]);
    const dimension = world.getDimension(object.dimension ?? source?.dimension.id ?? "overworld");
    const options: ExplosionOptions = {
        allowUnderwater: object.options?.allow_under_water,
        breaksBlocks: object.options?.breaks_blocks,
        causesFire: object.options?.causes_fire,
    };

    dimension.createExplosion(location, radius, options);
}
