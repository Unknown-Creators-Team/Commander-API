import { Block, Entity } from "@minecraft/server";
import * as v from "lib/valibot.js";
import { isTrue, parseFormat } from "../util.js";
import Vector from "lib/Vector.js";
import { ImpulseSchema, type Impulse } from "../schema.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Cannot apply impulse to a non-entity.");
    if (source?.isPlayer()) throw new Error("impulse is not supported for players");

    const parsed = parseFormat(message, source);
    const object = v.parse(ImpulseSchema, parsed);

    const isClearVelocity = object.clear_velocity;
    const vector = Vector.fromArray(object.vector);

    if (isClearVelocity) source.clearVelocity();
    source.applyImpulse(vector);
}

/*

/scriptevent capi:impulse {"vector": [0, 1, 0]}
*/
