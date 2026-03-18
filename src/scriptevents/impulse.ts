import { Block, Entity } from "@minecraft/server";
import { Vec3 } from "@bedrock-oss/bedrock-boost";
import * as v from "valibot";
import { ImpulseSchema } from "../schema.js";
import { parseFormat } from "../utils.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Cannot apply impulse to a non-entity.");
    if (source?.isPlayer()) throw new Error("impulse is not supported for players");

    const parsed = parseFormat(message, source);
    const object = v.parse(ImpulseSchema, parsed);

    const isClearVelocity = object.clear_velocity;
    const vector = Vec3.from(object.vector);

    if (isClearVelocity) source.clearVelocity();
    source.applyImpulse(vector);
}

/*

/scriptevent capi:impulse {"vector": [0, 1, 0]}
*/
