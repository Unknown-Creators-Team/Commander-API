import { Block, Entity, world } from "@minecraft/server";
import { bothParse, format, parsePos } from "../util.js";


export default function main(source: Entity | Block | undefined, message: string) {
    const object: SpawnEntity = bothParse(message);
    if (!object.id) throw new Error("Entity ID is required.");

    const { id, name } = object;

    const x = typeof object.x === "string" ? parsePos(object.x, source, "x") : object.x ?? source?.location.x ?? 0;
    const y = typeof object.y === "string" ? parsePos(object.y, source, "y") : object.y ?? source?.location.y ?? 0;
    const z = typeof object.z === "string" ? parsePos(object.z, source, "z") : object.z ?? source?.location.z ?? 0;
    const location = { x, y, z };
    const dimension = object.dimension ?? source?.dimension.id ?? "overworld";

    const fire = Number(object.set_on_fire ?? 0);

    const entity = world.getDimension(dimension).spawnEntity(id, location);
    if (name) entity.nameTag = name;
    if (fire) entity.setOnFire(fire);
}

interface SpawnEntity {
    id: string;
    name: string;
    x?: string | number;
    y?: string | number;
    z?: string | number;
    dimension?: string;
    set_on_fire?: string | number;
}