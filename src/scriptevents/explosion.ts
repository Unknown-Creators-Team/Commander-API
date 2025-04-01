import { Block, Entity, ExplosionOptions, world } from "@minecraft/server";
import { parsePos, parseFormat } from "../util.js";
import Vector from "lib/Vector.js";

export default function main(source: Entity | Block | undefined, message: string) {
    const object = parseFormat<Explosion>(message, source);
    if (object === undefined) throw new Error("Invalid format");

    if (object.radius === undefined) throw new Error("radius is required");

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

interface Explosion {
    radius: number;
    location: [number | string , number | string, number | string] | undefined;
    dimension: string | undefined;
    options:
        | {
              allow_under_water: boolean | undefined;
              breaks_blocks: boolean | undefined;
              causes_fire: boolean | undefined;
          }
        | undefined;
}
