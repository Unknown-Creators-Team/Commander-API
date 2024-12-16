import { Block, Entity } from "@minecraft/server";
import { format } from "../util.js";


export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot run command as a non-player entity.");
    
    source.runCommand(format(source, message) ?? message);
}