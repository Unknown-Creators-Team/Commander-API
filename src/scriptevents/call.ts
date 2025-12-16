import { Block, Entity, world } from "@minecraft/server";
import { ScoreboardDatabase } from "lib/DatabaseMC.js";
import { Macro } from "lib/Macro.js";
import * as v from "lib/valibot.js";
import { parseFormat } from "utils.js";
import { CallSchema } from "../schema.js";

export default function main(source: Entity | Block | undefined, message: string) {
    const parsed = parseFormat(message, source);
    const object = v.parse(CallSchema, parsed);

    const call = new ScoreboardDatabase<string, string[]>(`CAPI_CALLS`).get(object.name);
    if (!call) throw new Error(`Call '${object.name}' not found.`);

    for (let i = 1; i < call.length; i++) {
        if (call[i].startsWith("+")) {
            call[i - 1] += call[i].slice(1);
            call.splice(i, 1);
            i--;
        }
    }

    for (let cmd of call) {
        for (let arg in object.args) {
            cmd = cmd.replace(new RegExp(`{${arg}}`, "g"), object.args[arg]);
        }
        cmd = Macro.format(source, cmd);

        try {
            if (source?.isEntity()) {
                source.runCommand(cmd);
            } else {
                (source?.dimension ?? world.getDimension("overworld")).runCommand(cmd);
            }
        } catch (e) {
            throw `Failed to run command: ${cmd}\n${(e as Error).message}`;
        }
    }
}
