import { Block, Entity } from "@minecraft/server";
import { format, bothParse, parseFormat } from "../util.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Source must be an entity");

    const object = parseFormat<Knockback>(message, source);

    if (object === undefined) throw new Error("Invalid format");
    if (object.horizontal_force === undefined) throw new Error("horizontal_strength is required");
    if (object.horizontal_force.length !== 2) throw new Error("horizontal_strength must be an array of 2 numbers");
    if (object.vertical_strength === undefined) throw new Error("vertical_strength is required");

    const horizontalForce = {
        x: object.horizontal_force[0],
        z: object.horizontal_force[1],
    };
    const verticalStrength = object.vertical_strength;

    source.applyKnockback(horizontalForce, verticalStrength);
}

interface Knockback {
    horizontal_force: [number, number];
    vertical_strength: number;
}
