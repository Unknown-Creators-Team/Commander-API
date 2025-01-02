import { Block, Entity, ExplosionOptions, world } from "@minecraft/server";
import { bothParse, isTrue, parsePos, format } from "../util.js";

export default function main(source: Entity | Block | undefined, message: string) {
    const object: Explosion = bothParse(format(source, message) ?? "{}");

    if (object.radius === undefined) throw new Error("Radius is required.");

    const radius = Number(object.radius);

    const x = getCoordinate(object.x, source, "x");
    const y = getCoordinate(object.y, source, "y");
    const z = getCoordinate(object.z, source, "z");
    const location = { x, y, z };
    const dimension = object.dimension ?? source?.dimension.id ?? "overworld";
    const options: ExplosionOptions = {
        allowUnderwater: isTrue(object.options?.allow_under_water),
        breaksBlocks: isTrue(object.options?.breaks_blocks),
        causesFire: isTrue(object.options?.causes_fire),
        source: source?.isEntity() ? source : undefined,
    };

    try {
        world.getDimension(dimension).createExplosion(location, radius, options);
    } catch {}
}

interface Explosion {
    radius: string | number;
    x?: string | number;
    y?: string | number;
    z?: string | number;
    dimension?: string;
    options?: {
        allow_under_water?: string | boolean;
        breaks_blocks?: string | boolean;
        causes_fire?: string | boolean;
    };
}

function getCoordinate(value: string | number | undefined, source: Entity | Block | undefined, axis: "x" | "y" | "z") {
    return typeof value === "string" ? parsePos(value, source, axis) : value ?? source?.location[axis] ?? 0;
}
