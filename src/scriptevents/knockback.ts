import { Block, Entity } from "@minecraft/server";
import * as v from "lib/valibot.js";
import { KnockbackSchema } from "../schema.js";
import { parseFormat } from "../utils.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Source must be an entity");

    const parsed = parseFormat(message, source);
    const object = v.parse(KnockbackSchema, parsed);

    const horizontalForce = {
        x: object.horizontal_force[0],
        z: object.horizontal_force[1],
    };
    const verticalStrength = object.vertical_strength;

    source.applyKnockback(horizontalForce, verticalStrength);
}
