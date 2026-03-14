import { CommandPermissionLevel, CustomCommandParamType, CustomCommandResult, CustomCommandStatus, world } from "@minecraft/server";
import { ExecCommandSchema, ScriptEventCommandSchema } from "schema.js";
import * as v from "valibot";
import { promiseDelay } from "utils.js";

let config: typeof import("../data/config.js").original | undefined;
const cache: Map<string, CallableFunction> = new Map();

world.afterEvents.worldLoad.subscribe(async () => {
    config = (await import("../data/config.js")).default;
});

const main: SlashCommand = [
    {
        name: "capi:exec",
        description: "execute as §l@a§r run scriptevent capi:§lXXX§r §l...§r を短縮します。",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        cheatsRequired: true,
        mandatoryParameters: [
            {
                name: "target",
                type: CustomCommandParamType.EntitySelector,
            },
            {
                name: "eventName",
                type: CustomCommandParamType.String,
            },
        ],
        optionalParameters: Array(6)
            .fill({})
            .map((_, i) => ({
                name: `args${i}`,
                type: CustomCommandParamType.String,
            })),
    },
    (_, ...args_) => {
        if (!config) return fail("Configuration not loaded yet. Please try again later.");
        const result = v.safeParse(ExecCommandSchema, args_);
        if (!result.success) return fail(`Invalid arguments: ${v.summarize(result.issues)}`);
        let [sources, id, ...args] = result.output;
        const message = args.filter((arg) => arg !== undefined).join(" ");

        id = sanitize(id).replace(/^(capi)/, "");
        const module = Object.entries(config.scriptevents).find(([key, value]) => sanitize(value.name) === id);
        if (!module) return fail(`Module '${id}' not found.`);

        const path = `../scriptevents/${sanitize(module[0])}`;

        if (cache.has(path)) {
            try {
                for (const source of sources) promiseDelay(() => cache.get(path)!(source, message));
                return success();
            } catch (e) {
                return fail(`An error occurred while executing the command: ${(e as Error).message}`);
            }
        } else {
            import(path)
                .then((module) => {
                    if (typeof module.default === "function") {
                        for (const source of sources) module.default(source, message);
                        cache.set(path, module.default);
                    } else {
                        console.error(`Module '${id}' is not a function.`);
                    }
                })
                .catch((e) => {
                    console.error(e, "\n" + e.stack);
                });
            return success();
        }

        return fail("An error occurred while executing the command.");
    },
];

export default main;

function sanitize(str: string) {
    return str.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
}

function fail(message?: string): CustomCommandResult {
    return { status: CustomCommandStatus.Failure, message };
}

function success(message?: string): CustomCommandResult {
    return { status: CustomCommandStatus.Success, message };
}
