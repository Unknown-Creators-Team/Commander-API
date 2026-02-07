import { Block, Entity, system } from "@minecraft/server";
import config from "data/config.js";
import { Macro } from "lib/Macro.js";
import * as v from "lib/valibot.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!config.others.extensions["Commander-API-Extension"].forceUse && !system.isCapiExtensionLoaded)
        throw new Error("Commander API Extension is not loaded.");

    if (!source?.isPlayer()) throw new Error("This event can only be called by a player");

    const attackString = Macro.format(source, message);

    if (attackString) {
        v.parse(v.pipe(v.string(), v.regex(/^-?(\d|\.)+$/)), attackString, { message: "attack must be a valid number" });
        let attack = parseFloat(attackString);

        attack = Math.max(Math.min(attack, 200), 0);
        attack = Math.floor(attack);

        source.runCommand(`event entity @s capi:attack_${attack}`);
    } else {
        source.runCommand(`event entity @s capi:attack_1`);
    }
}
