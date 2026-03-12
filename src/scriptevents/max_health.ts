import { Block, Entity, system } from "@minecraft/server";
import config from "data/config.js";
import { Macro } from "lib/Macro.js";
import * as v from "lib/valibot.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!config.others.extensions["Commander-API-Extension"].forceUse && !system.isCapiExtensionLoaded)
        throw new Error("Commander API Extension is not loaded.");

    if (!source?.isPlayer()) throw new Error("This event can only be called by a player");

    const healthString = Macro.format(source, message);

    if (healthString) {
        v.parse(v.pipe(v.string(), v.regex(/^-?(\d|\.)+$/)), healthString, { message: "health must be a valid number" });
        let health = parseFloat(healthString);

        health = Math.max(Math.min(health, 200), 0);
        health = Math.floor(health);

        source.runCommand(`event entity @s capi:health_${health}`);
    } else {
        source.runCommand(`event entity @s capi:health_1`);
    }
}
