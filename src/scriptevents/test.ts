import { Block, Entity, ExplosionOptions, Player } from "@minecraft/server";
import Test from "lib/Test.js";
import Vector from "lib/Vector.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.location) throw new Error("This event can only be called by an entity or block with a location");

    if (message) Test.runTest(message, Vector.from(source.location));
    else Test.runAll(Vector.from(source.location));
}
