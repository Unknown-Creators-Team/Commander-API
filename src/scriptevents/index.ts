import { system } from "@minecraft/server";
import config from "../data/config.js";

const cache: Map<string, CallableFunction> = new Map();

system.afterEvents.scriptEventReceive.subscribe(
    function (event) {
        const { message, sourceEntity: player, sourceBlock: block } = event;
        const id = event.id.split(":").slice(1).join(":");

        if (["config", "calls"].includes(id)) return;
        const source = player ?? block;

        if (!source?.isEntity() && !block?.isBlock()) return;

        const module = Object.entries(config.scriptevents).find(([key, value]) => sanitize(value.name) === sanitize(id));
        if (!module) return console.warn(`Module '${id}' not found.`);

        const path = `./${sanitize(module[0])}`;

        if (cache.has(path)) {
            try {
                cache.get(path)!(source, message);
            } catch (e) {
                console.error(e, (e as Error).stack);
            }
        } else {
            import(path)
                .then((module) => {
                    if (typeof module.default === "function") {
                        module.default(source, message);

                        cache.set(path, module.default);
                    } else {
                        return console.error(`Module '${id}' is not a function.`);
                    }
                })
                .catch((e) => {
                    console.error(e, e.stack);
                });
        }
    },
    { namespaces: ["capi" /*, "Capi", "cApi", "cAPI", "CApi", "CAPI", "C-API"*/] }
);

console.info(`Loaded script event handler`);

function sanitize(str: string) {
    return str.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
}
