import { Block, Entity, TitleDisplayOptions, world } from "@minecraft/server";
import * as v from "lib/valibot.js";
import { format, parseFormat } from "../util.js";
import { ScreenSchema, type Screen } from "../schema.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot use this script event in non-player entity.");

    let options: TitleDisplayOptions | undefined;
    const parsed = parseFormat(message, source);
    const object = v.parse(ScreenSchema, parsed);
    if (object.options) {
        options = {
            fadeInDuration: object.options.in,
            fadeOutDuration: object.options.out,
            stayDuration: object.options.stay,
        };
    }

    source.onScreenDisplay.setTitle(object.title, options);
    if (object.subtitle) {
        source.onScreenDisplay.updateSubtitle(object.subtitle);
    }
}
