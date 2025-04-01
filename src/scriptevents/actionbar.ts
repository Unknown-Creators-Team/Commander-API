import { Block, Entity, TitleDisplayOptions, world } from "@minecraft/server";
import { format, parseFormat } from "../util.js";
import { Macro } from "lib/Macro.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot use this script event in non-player entity.");

    const text = Macro.format(source, message);
    source.onScreenDisplay.setActionBar(text);
}