import { Player, system } from "@minecraft/server";
import modules from "../data/modules.js";

const cache: Map<string, CallableFunction> = new Map();

system.afterEvents.scriptEventReceive.subscribe(
    function (event) {
        const { message, sourceEntity: player, sourceBlock: block } = event;
        const id = event.id.split(":").slice(1).join(":");

        const source = player ?? block;

        if (!source?.isEntity() && !block?.isBlock()) return;

        const module = modules.scriptevents.find((module) => sanitize(module) === sanitize(id));
        if (!module) throw new Error(`Module '${id}' not found.`);

        const path = `./${sanitize(id)}`;

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
                        throw new Error(`Module '${id}' is not a function.`);
                    }
                })
                .catch((e) => {
                    console.error(e, e.stack);
                });
        }
    },
    { namespaces: ["capi" /*, "Capi", "cApi", "cAPI", "CApi", "CAPI", "C-API"*/] }
);

function sanitize(str: string) {
    return str.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
}
