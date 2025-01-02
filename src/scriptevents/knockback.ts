import { Block, Entity } from "@minecraft/server";
import { format, bothParse } from "../util.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Source must be an entity");

    const data: Knockback = bothParse(message);

    if (data.direction_x === undefined) throw new Error("direction_x is required");
    if (data.direction_z === undefined) throw new Error("direction_z is required");
    if (data.horizontal_strength === undefined) throw new Error("horizontal_strength is required");
    if (data.vertical_strength === undefined) throw new Error("vertical_strength is required");

    const directionX = toNumber(source, data.direction_x);
    const directionZ = toNumber(source, data.direction_z);
    const horizontalStrength = toNumber(source, data.horizontal_strength);
    const verticalStrength = toNumber(source, data.vertical_strength);

    source.applyKnockback(directionX, directionZ, horizontalStrength, verticalStrength);
}

interface Knockback {
    direction_x: string | number;
    direction_z: string | number;
    horizontal_strength: string | number;
    vertical_strength: string | number;
}

function toNumber(source: Entity, value: string | number): number {
    return typeof value === "string" ? Number(format(source, value)) : value;
}
