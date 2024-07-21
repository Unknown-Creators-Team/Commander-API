import { Block, Entity, world } from "@minecraft/server";
import { setVariable } from "../util";


export default function main(source: Entity | Block | undefined, message: string) {
    world.sendMessage(setVariable(source, message) ?? message);
}