import { Block, Entity } from "@minecraft/server";
import { Macro } from "lib/Macro.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("This event can only be called by a player");

    const team = Macro.format(source, message);

    console.warn(`Team set to: ${team}`);

    if (team) {
        source.setProperty("capi:team", parseInt(team));
    } else {
        source.resetProperty("capi:team");
    }
}
