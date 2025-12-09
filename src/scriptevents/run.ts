import { Block, Entity } from "@minecraft/server";
import { Macro } from "lib/Macro.js";

export default function main(source: Entity | Block | undefined, message: string) {
    // if (!source?.isEntity()) throw new Error("Cannot run command as a non-entity.");

    if (source?.isEntity()) {
        source.runCommand(Macro.format(source, message) ?? message);
    } else if (source?.isBlock()) {
        source.dimension.runCommand(Macro.format(source, message) ?? message);
    } else {
        throw new Error("Source must be an entity or a block to run a command.");
    }
}
