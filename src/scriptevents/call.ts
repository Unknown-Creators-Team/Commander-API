import { Block, Entity, world } from "@minecraft/server";
import { ScoreboardDatabase } from "lib/DatabaseMC.js";
import { Macro } from "lib/Macro.js";
import { parseFormat } from "util.js";

export default function main(source: Entity | Block | undefined, message: string) {
    
    const object = parseFormat<Call>(message, source);
    if (object === undefined) throw new Error("Invalid format.");

    if (object.name === undefined) throw new Error("name is required.");

    const call = new ScoreboardDatabase<string, string[]>(`CAPI_CALLS`).get(object.name);
    if (!call) throw new Error(`Call '${object.name}' not found.`);

    for (let cmd of call) {
        for (let arg in object.args) {
            cmd = cmd.replace(new RegExp(`{${arg}}`, "g"), object.args[arg]);
        }
        cmd = Macro.format(source, cmd);

        if (source?.isEntity()) {
            source.runCommand(cmd);
        } else {
            (source?.dimension ?? world.getDimension("overworld")).runCommand(cmd);
        }
    }
}

interface Call {
    name: string;
    args: Record<string, any> | undefined;
}