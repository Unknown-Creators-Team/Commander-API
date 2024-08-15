import { Player, system } from "@minecraft/server";
import modules from "../data/modules.js";

const cache: Map<string, CallableFunction> = new Map();

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { message, sourceEntity: player, sourceBlock: block } = event;
    const id = event.id.split(":").slice(1).join(":");

    const source = player ?? block;

    if (!source?.isPlayer() && !block?.isBlock()) return;

    const module = modules.scriptevents.find(module => sanitize(module) === sanitize(id));
    if (!module) throw new Error(`Module '${id}' not found.`);

    const path = `./${sanitize(id)}`;

    if (cache.has(path)) {
        cache.get(path)!(source, message);
    } else {
        import(path)
        .then(module => {
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
});

function sanitize(str: string) {
    return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}