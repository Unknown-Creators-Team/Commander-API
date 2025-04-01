import { world } from "@minecraft/server";
import config from "data/config.js";

export function log(...messages: unknown[]) {
    if (!config.basic.debug.log) return;
    for (const player of world.getAllPlayers()) {
        if (player.isOp()) {
            player.sendMessage(`[Scripting][log]-${messages.join(" ")}`);
        }
    }
}

export function info(...messages: unknown[]) {
    if (!config.basic.debug.info) return;
    for (const player of world.getAllPlayers()) {
        if (player.isOp()) {
            player.sendMessage(`§b[Scripting][info]-${messages.join(" ")}`);
        }
    }
}

export function warn(...messages: unknown[]) {
    if (!config.basic.debug.warn) return;
    for (const player of world.getAllPlayers()) {
        if (player.isOp()) {
            player.sendMessage(`§e[Scripting][warning]-${messages.join(" ")}`);
        }
    }
}

export function error(...messages: unknown[]) {
    if (!config.basic.debug.error) return;
    for (const player of world.getAllPlayers()) {
        if (player.isOp()) {
            player.sendMessage(`§c[Scripting][error]-${messages.join(" ")}`);
        }
    }
}


console.log = log;
console.info = info;
console.warn = warn;
console.error = error;

info("Logger loaded");
