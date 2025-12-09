import { PlayerPermissionLevel, world } from "@minecraft/server";
import config from "data/config.js";

export function log(...messages: unknown[]) {
    if (!config.basic.debug.log) return;
    for (const player of world.getAllPlayers()) {
        if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
            player.sendMessage(`[CAPI][log]-${messages.join(" ")}`);
        }
    }
}

export function info(...messages: unknown[]) {
    if (!config.basic.debug.info) return;
    for (const player of world.getAllPlayers()) {
        if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
            player.sendMessage(`§b[CAPI][info]-${messages.join(" ")}`);
        }
    }
}

export function warn(...messages: unknown[]) {
    if (!config.basic.debug.warn) return;
    for (const player of world.getAllPlayers()) {
        if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
            player.sendMessage(`§e[CAPI][warning]-${messages.join(" ")}`);
        }
    }
}

export function error(...messages: unknown[]) {
    if (!config.basic.debug.error) return;
    for (const player of world.getAllPlayers()) {
        if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
            player.sendMessage(`§c[CAPI][error]-${messages.join(" ")}`);
        }
    }
}

console.log = log;
console.info = info;
console.warn = warn;
console.error = error;

info("Logger loaded");
