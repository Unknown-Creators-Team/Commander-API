import { Block, Entity, world } from "@minecraft/server";
import { format, bothParse, parsePos, parseFormat } from "../util.js";
import Vector from "lib/Vector.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Cannot teleport a non-entity.");

    const object = parseFormat<Teleport>(message, source);
    if (object === undefined) throw new Error("Invalid format");

    if (object.location === undefined) throw new Error("location is required");
    if (object.location.length !== 3) throw new Error("location must be an array of 3 numbers");

    const location = Vector.fromArray(object.location.map((v, i) => parsePos(v.toString(), source, ["x", "y", "z"][i] as "x")));
    const rotation = {
        x: parsePos(object.rotation?.[0]?.toString() ?? "0", source, "rx"),
        y: parsePos(object.rotation?.[1]?.toString() ?? "0", source, "ry"),
    };
    const dimension = source?.dimension ?? world.getDimension(object.dimension ?? "overworld");

    source.teleport(location, { rotation, dimension });
}

interface Teleport {
    location: [number | string, number | string, number | string];
    rotation: [number | string, number | string] | undefined;
    dimension: string | undefined;
}
