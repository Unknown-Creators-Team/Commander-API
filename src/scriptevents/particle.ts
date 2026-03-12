import { Block, Entity, MolangVariableMap } from "@minecraft/server";
import * as v from "lib/valibot.js";
import Vector from "lib/Vector.js";
import { ParticleSchema } from "../schema.js";
import { parseFormat, parsePos } from "../utils.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot use this script event in non-player entity.");

    const parsed = parseFormat(message, source);
    const object = v.parse(ParticleSchema, parsed);
    const location = Vector.fromArray(object.location?.map((v, i) => parsePos(v.toString(), source, ["x", "y", "z"][i] as "x")) ?? [0, 0, 0]);
    const rgba = object.rgba || [];

    const molang = new MolangVariableMap();
    molang.setColorRGBA("variable.color", {
        red: rgba[0] ?? 0,
        green: rgba[1] ?? 0,
        blue: rgba[2] ?? 0,
        alpha: rgba[3] ?? 1,
    });
    // molang.setFloat()

    source.spawnParticle(object.id, location, molang);
}