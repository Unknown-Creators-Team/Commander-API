import { Block, Entity, system } from "@minecraft/server";
import config from "data/config.js";
import { Macro } from "lib/Macro.js";
import * as v from "lib/valibot.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!config.others.extensions["Commander-API-Extension"].forceUse && !system.isCapiExtensionLoaded)
        throw new Error("Commander API Extension is not loaded.");

    if (!source?.isPlayer()) throw new Error("This event can only be called by a player");

    const sizeString = Macro.format(source, message);

    if (sizeString) {
        v.parse(v.pipe(v.string(), v.regex(/^-?(\d|\.)+$/)), sizeString, { message: "size must be a valid number" });
        let size = parseFloat(sizeString);

        size = Math.max(Math.min(size, 10), 0);
        size = Math.floor(size * 100) / 100;

        source.runCommand(`event entity @s capi:size_${size}`);
    } else {
        source.runCommand(`event entity @s capi:size_1`);
    }
}
