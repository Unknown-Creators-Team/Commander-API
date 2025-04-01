import { Block, Entity } from "@minecraft/server";
import { isTrue, parseFormat } from "../util.js";
import Vector from "lib/Vector.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Cannot apply impulse to a non-entity.");
    if (source?.isPlayer()) throw new Error("impulse is not supported for players");

    const object = parseFormat<Impulse>(message, source);

    if (object === undefined) throw new Error("Invalid format");
    if (object.vector === undefined) throw new Error("vector is required");
    if (object.vector.length !== 3) throw new Error("vector must be an array of 3 numbers");

    const isClearVelocity = object.clear_velocity;
    const vector = Vector.fromArray(object.vector);

    if (isClearVelocity) source.clearVelocity();
    source.applyImpulse(vector);
}

interface Impulse {
    clear_velocity: boolean | undefined;
    vector: [number, number, number];
}

/*

/scriptevent capi:impulse {"vector": [0, 1, 0]}
*/
