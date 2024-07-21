import { world } from "@minecraft/server";

export function log(...messages: unknown[]) {
    for (const player of world.getAllPlayers()) {
        if (player.isOp()) {
            player.sendMessage(`[Scripting][log]-${messages.join(" ")}`);
        }
    }
}

export function warn(...messages: unknown[]) {
    for (const player of world.getAllPlayers()) {
        if (player.isOp()) {
            player.sendMessage(`§g[Scripting][warning]-${messages.join(" ")}`);
        }
    }
}

export function error(...messages: unknown[]) {
    for (const player of world.getAllPlayers()) {
        if (player.isOp()) {
            player.sendMessage(`§c[Scripting][error]-${messages.join(" ")}`);
        }
    }
}

console.log = log;
console.warn = warn;
console.error = error;

log("Logger loaded!");