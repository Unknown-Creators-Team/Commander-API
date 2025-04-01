import { Block, Entity, Vector3, world } from "@minecraft/server";
import { format, bothParse, parsePos, parseFormat } from "../util.js";
import Vector from "lib/Vector.js";

export default function main(source: Entity | Block | undefined, message: string) {
    const object = parseFormat<Shoot>(message, source);
    if (object === undefined) throw new Error("Invalid format");

    if (object.id === undefined) throw new Error("id is required");
    if (object.location === undefined) throw new Error("location is required");
    if (object.location.length !== 3) throw new Error("location must be an array of 3 numbers");
    if (object.vector === undefined) throw new Error("vector is required");
    if (object.vector.length !== 3) throw new Error("vector must be an array of 3 numbers");

    const location = Vector.fromArray(object.location.map((v, i) => parsePos(v.toString(), source, ["x", "y", "z"][i] as "x")));
    const vector = Vector.fromArray(object.vector);
    const dimension = source?.dimension ?? world.getDimension(object.dimension ?? "overworld");
    const speed = object.speed ?? 1;

    if (isNaN(speed)) throw new Error("speed must be a number");
    if (speed <= 0) throw new Error("speed must be greater than 0");

    const entity = dimension.spawnEntity(object.id, location);
    if (object.fire) entity.setOnFire(object.fire);
    if (object.nameTag) entity.nameTag = object.nameTag;

    entity.applyImpulse(Vector.multiply(vector, speed));
}

interface Shoot {
    id: string;
    nameTag: string | undefined;
    fire: number | undefined;
    location: [number | string , number | string, number | string];
    vector: [number, number, number];
    speed: number | undefined;
    dimension: string | undefined;
}
