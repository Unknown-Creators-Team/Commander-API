import { Block, Entity, MolangVariableMap, RGBA, Vector3 } from "@minecraft/server";
import * as v from "valibot";
import { ParticleRgbaSchema, ParticleSchema, ParticleVector3Schema } from "../schema.js";
import { parseFormat, parsePos } from "../utils.js";
import { Vec3 } from "@bedrock-oss/bedrock-boost";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot use this script event in non-player entity.");

    const parsed = parseFormat(message, source);
    const object = v.parse(ParticleSchema, parsed);
    const location = Vec3.from(object.location?.map((v, i) => parsePos(v.toString(), source, (["x", "y", "z"] as const)[i])) ?? [0, 0, 0]);
    const variables = object.variables || {};
    const molang = new MolangVariableMap();

    for (const [key, value] of Object.entries(variables)) {
        if (typeof value === "number") {
            molang.setFloat(key, value);
            continue;
        }

        const vec = v.safeParse(ParticleVector3Schema, value);
        if (vec.success) {
            molang.setVector3(key, vec.output);
            continue;
        }

        const rgba = v.safeParse(ParticleRgbaSchema, value);
        if (rgba.success) {
            const { r, g, b, a } = rgba.output;
            molang.setColorRGBA(key, {
                red: r,
                green: g,
                blue: b,
                alpha: a ?? 1,
            });
        }
    }

    source.spawnParticle(object.id, location, molang);
}
