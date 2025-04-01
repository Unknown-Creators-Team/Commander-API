import { Block, Entity, TitleDisplayOptions, world } from "@minecraft/server";
import { format, parseFormat } from "../util.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot use this script event in non-player entity.");

    let options: TitleDisplayOptions | undefined;
    const object = parseFormat<Screen>(message, source);
    if (object === undefined) return;

    if (object.title === undefined) throw TypeError("Title is required.");
    if (object.options) {
        if (object.options.in === undefined) throw TypeError("In time is required.");
        if (object.options.out === undefined) throw TypeError("Out time is required.");
        if (object.options.stay === undefined) throw TypeError("Stay time is required.");

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

interface Screen {
    title: string;
    subtitle: string | undefined;
    options:
        | {
              in: number;
              out: number;
              stay: number;
          }
        | undefined;
}
