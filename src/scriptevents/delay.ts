import { Block, Entity, system, world } from "@minecraft/server";
import * as v from "valibot";
import { parseFormat } from "../utils.js";
import { DelaySchema } from "../schema.js";

export default function main(source: Entity | Block | undefined, message: string) {
    const parsed = parseFormat(message, source);
    const object = v.parse(DelaySchema, parsed);

    system.runTimeout(() => {
        if (source?.isEntity()) {
            source.runCommand(object.command);
        } else if (source?.isBlock()) {
            source.dimension.runCommand(object.command);
        } else {
            world.getDimension("overworld").runCommand(object.command);
        }
    }, object.ticks);
}
