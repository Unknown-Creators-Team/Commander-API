import { Block, Entity } from "@minecraft/server";
import { bothParse, format, isTrue } from "../util.js";
import Vector from "lib/Vector.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Cannot apply impulse to a non-entity.");
    if (source?.isPlayer()) throw new Error("impulse is not supported for players");

    const data = bothParse(format(source, message) ?? "{}");
    const isClearVelocity = isTrue(data.clear_velocity);
    const vector = Vector.fromObject(Object.fromEntries(Object.entries(data).map(([key, value]) => [key, Number(value)])) as any);

    if (isClearVelocity) source.clearVelocity();

    source.applyImpulse(vector);
}
