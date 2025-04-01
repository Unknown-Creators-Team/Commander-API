import { Block, Entity, ExplosionOptions, Player } from "@minecraft/server";
import { format } from "../util.js";
import { Macro } from "lib/Macro.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("This event can only be called by a player");

    const text = Macro.format(source, message);
    source.sendMessage(text ?? message);
}
