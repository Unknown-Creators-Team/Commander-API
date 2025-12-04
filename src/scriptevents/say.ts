import { Block, Entity, world } from "@minecraft/server";
import { Macro } from "lib/Macro.js";

export default function main(source: Entity | Block | undefined, message: string) {
    world.sendMessage(Macro.format(source, message) ?? message);
}
