import { PlayerPermissionLevel, world } from "@minecraft/server";
import config from "data/config.js";
import { chalk } from "mc-chalk";

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
            player.sendMessage(chalk.blue(`[CAPI][info]-${messages.join(" ")}`));
        }
    }
}

export function warn(...messages: unknown[]) {
    if (!config.basic.debug.warn) return;
    for (const player of world.getAllPlayers()) {
        if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
            player.sendMessage(chalk.yellow(`[CAPI][warning]-${messages.join(" ")}`));
        }
    }
}

const originalError = console.error;

export function error(...messages: unknown[]) {
    if (!config.basic.debug.error) return;
    for (const player of world.getAllPlayers()) {
        if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
            player.sendMessage(chalk.red(`[CAPI][error]-${messages.join(" ")}`));
        }
    }
    originalError(...messages);
}

console.log = log;
console.info = info;
console.warn = warn;
console.error = error;

info("Logger loaded");
