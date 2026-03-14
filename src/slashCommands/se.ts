import { CommandPermissionLevel, CustomCommandParamType, CustomCommandResult, CustomCommandStatus, system, world } from "@minecraft/server";
import * as v from "valibot";
import { ScriptEventCommandSchema } from "schema.js";
import { promiseDelay } from "utils.js";

let config: typeof import("../data/config.js").original | undefined;
const cache: Map<string, CallableFunction> = new Map();

world.afterEvents.worldLoad.subscribe(async () => {
    config = (await import("../data/config.js")).default;
});

const main: SlashCommand = [
    {
        name: "capi:se",
        description: "scriptevent capi:§lXXX§r §l...§r を短縮します。",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        cheatsRequired: true,
        mandatoryParameters: [
            {
                name: "eventName",
                type: CustomCommandParamType.String,
            },
        ],
        optionalParameters: Array(7)
            .fill({})
            .map((_, i) => ({
                name: `args${i}`,
                type: CustomCommandParamType.String,
            })),
    },
    (origin, ...args_) => {
        if (!config) return fail("Configuration not loaded yet. Please try again later.");
        const result = v.safeParse(ScriptEventCommandSchema, args_);
        if (!result.success) return fail(`Invalid arguments: ${v.summarize(result.issues)}`);
        let [id, ...args] = result.output;
        const { initiator, sourceEntity: entity, sourceBlock: block } = origin;
        const source = entity ?? block ?? initiator;
        const message = args.filter((arg) => arg !== undefined).join(" ");
        if (!source?.isEntity() && !source?.isBlock()) return fail("This command can only be run by an entity or a block.");

        id = sanitize(id).replace(/^(capi)/, "");
        const module = Object.entries(config.scriptevents).find(([key, value]) => sanitize(value.name) === id);
        if (!module) return fail(`Module '${id}' not found.`);

        const path = `../scriptevents/${sanitize(module[0])}`;

        if (cache.has(path)) {
            try {
                promiseDelay(() => cache.get(path)!(source, message));
                return success();
            } catch (e) {
                // console.error(e, (e as Error).stack);
                return fail(`An error occurred while executing the command: ${(e as Error).message}`);
            }
        } else {
            import(path)
                .then((module) => {
                    if (typeof module.default === "function") {
                        module.default(source, message);
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
