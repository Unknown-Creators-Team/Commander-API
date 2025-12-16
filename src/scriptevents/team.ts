import { Block, Entity, system } from "@minecraft/server";
import config from "data/config.js";
import { Macro } from "lib/Macro.js";
import * as v from "lib/valibot.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!config.others.extensions["Commander-API-Extension"].forceUse && !system.isCapiExtensionLoaded)
        throw new Error("Commander-API-Extension is not loaded.");

    if (!source?.isPlayer()) throw new Error("This event can only be called by a player");

    const team = Macro.format(source, message);

    if (team) {
        v.parse(v.pipe(v.string(), v.regex(/^-?\d+$/)), team, { message: "team must be a valid integer string" });
        v.parse(v.pipe(v.number(), v.minValue(0), v.maxValue(40)), parseInt(team));
        source.setProperty("capi:team", parseInt(team));
    } else {
        source.resetProperty("capi:team");
    }
}
