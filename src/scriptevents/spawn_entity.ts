import { Block, Entity, world } from "@minecraft/server";
import { bothParse, format, parseFormat, parsePos } from "../util.js";
import Vector from "lib/Vector.js";

export default function main(source: Entity | Block | undefined, message: string) {
    // const object: SpawnEntity = bothParse(message);
    // if (!object.id) throw new Error("Entity ID is required.");

    // const { id, name } = object;

    // const x = typeof object.x === "string" ? parsePos(object.x, source, "x") : object.x ?? source?.location.x ?? 0;
    // const y = typeof object.y === "string" ? parsePos(object.y, source, "y") : object.y ?? source?.location.y ?? 0;
    // const z = typeof object.z === "string" ? parsePos(object.z, source, "z") : object.z ?? source?.location.z ?? 0;
    // const location = { x, y, z };
    // const dimension = object.dimension ?? source?.dimension.id ?? "overworld";

    // const fire = Number(object.set_on_fire ?? 0);

    // const entity = world.getDimension(dimension).spawnEntity(id, location);
    // if (name) entity.nameTag = name;
    // if (fire) entity.setOnFire(fire);

    const object = parseFormat<SpawnEntity>(message, source);
    if (object === undefined) throw new Error("Invalid format");

    if (object.id === undefined) throw new Error("id is required");

    const location = Vector.fromArray(object.location?.map((v, i) => parsePos(v.toString(), source, ["x", "y", "z"][i] as "x")) ?? [0, 0, 0]);
    const dimension = source?.dimension ?? world.getDimension(object.dimension ?? "overworld");

    const entity = dimension.spawnEntity(object.id, location);
    if (object.name) entity.nameTag = object.name;
    if (object.set_on_fire) entity.setOnFire(parseInt(object.set_on_fire.toString()));
}

interface SpawnEntity {
    id: string;
    name: string | undefined;
    location: [number | string , number | string, number | string] | undefined;
    dimension: string | undefined;
    set_on_fire: number | undefined;
}
