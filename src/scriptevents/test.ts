import { Vec3 } from "@bedrock-oss/bedrock-boost";
import { Block, Entity } from "@minecraft/server";
import Test from "lib/Test.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.location) throw new Error("This e    vent can only be called by an entity or block with a location");

    if (message) Test.runTest(message, Vec3.from(source.location));
    else Test.runAll(Vec3.from(source.location));
}
