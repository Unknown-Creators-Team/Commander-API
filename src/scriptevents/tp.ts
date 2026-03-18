import { Block, Entity, world } from "@minecraft/server";
import * as v from "valibot";
import { Vec3 } from "@bedrock-oss/bedrock-boost";
import { TeleportSchema } from "../schema.js";
import { parseFormat, parsePos } from "../utils.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Cannot teleport a non-entity.");

    const parsed = parseFormat(message, source);
    const object = v.parse(TeleportSchema, parsed);

    const location = Vec3.from(object.location.map((v, i) => parsePos(v.toString(), source, (["x", "y", "z"] as const)[i])));
    const rotation = {
        x: parsePos(object.rotation?.[0]?.toString() ?? "0", source, "rx"),
        y: parsePos(object.rotation?.[1]?.toString() ?? "0", source, "ry"),
    };
    const dimension = object.dimension ? world.getDimension(object.dimension) : undefined;

    source.teleport(location, { rotation, dimension });
}
