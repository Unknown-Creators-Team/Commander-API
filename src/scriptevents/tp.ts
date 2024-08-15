import { Block, Entity, world } from "@minecraft/server";
import { setVariable, bothParse, parsePos } from "../util.js";


export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Cannot teleport a non-entity.");
    const object: Teleport = bothParse(message);

    const x = typeof object.x === "string" ? parsePos(object.x, source, "x") : object.x ?? source?.location.x ?? 0;
    const y = typeof object.y === "string" ? parsePos(object.y, source, "y") : object.y ?? source?.location.y ?? 0;
    const z = typeof object.z === "string" ? parsePos(object.z, source, "z") : object.z ?? source?.location.z ?? 0;
    const rx = typeof object.rx === "string" ? parsePos(object.rx, source, "rx") : object.rx ?? source?.getRotation().x ?? 0;
    const ry = typeof object.ry === "string" ? parsePos(object.ry, source, "ry") : object.ry ?? source?.getRotation().y ?? 0;
    const location = { x, y, z };
    const rotation = { x: rx, y: ry };
    const dimension = world.getDimension(object.dimension ?? source?.dimension.id ?? "overworld");

    source.teleport(location, { rotation, dimension });
}

interface Teleport {
    x: string | number;
    y: string | number;
    z: string | number;
    rx?: string | number;
    ry?: string | number;
    dimension?: string;
}