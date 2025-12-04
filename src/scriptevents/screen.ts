import { Block, Entity, TitleDisplayOptions } from "@minecraft/server";
import * as v from "lib/valibot.js";
import { ScreenSchema } from "../schema.js";
import { parseFormat } from "../util.js";

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
