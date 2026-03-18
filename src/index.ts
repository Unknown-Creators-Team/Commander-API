/**
 *
 * ░█████╗░░█████╗░███╗░░░███╗███╗░░░███╗░█████╗░███╗░░██╗██████╗░███████╗██████╗░  ░█████╗░██████╗░██╗
 * ██╔══██╗██╔══██╗████╗░████║████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝██╔══██╗  ██╔══██╗██╔══██╗██║
 * ██║░░╚═╝██║░░██║██╔████╔██║██╔████╔██║███████║██╔██╗██║██║░░██║█████╗░░██████╔╝  ███████║██████╔╝██║
 * ██║░░██╗██║░░██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚████║██║░░██║██╔══╝░░██╔══██╗  ██╔══██║██╔═══╝░██║
 * ╚█████╔╝╚█████╔╝██║░╚═╝░██║██║░╚═╝░██║██║░░██║██║░╚███║██████╔╝███████╗██║░░██║  ██║░░██║██║░░░░░██║
 * ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░╚══════╝╚═╝░░╚═╝  ╚═╝░░╚═╝╚═╝░░░░░╚═╝
 *
 * @LICENSE MIT
 * @AUTHORS Nano, arutaka
 * @LINK https://github.com/191225/Commander-API
 */

import { Timings } from "@bedrock-oss/bedrock-boost";
import * as Minecraft from "@minecraft/server";
import { CHANNEL, VERSION } from "constants.js";
import { ScoreboardUtils } from "script-box-mc";
import "slashCommands/index.js";
const { world, system } = Minecraft;

world.afterEvents.worldLoad.subscribe(async (ev) => {
    const config = await import("./data/config.js");
    import("./native.js");
    if (config.default.basic.debug.enabled) await import("./utils/logger.js");
    import("./events/index.js");
    import("./scriptevents/index.js");
    import("./gametests/index.js");
    const { ConfigUI } = await import("./ui/index.js");
    const { CallsUI } = await import("./ui/calls.js");

    system.beforeEvents.watchdogTerminate.subscribe((beforeWatchdogTerminate) => (beforeWatchdogTerminate.cancel = true));

    system.afterEvents.scriptEventReceive.subscribe(
        (event) => {
            const { id, sourceEntity } = event;
            if (id === "capi:config" && sourceEntity?.isPlayer()) {
                ConfigUI.Open(sourceEntity);
            } else if (id === "capi:calls" && sourceEntity?.isPlayer()) {
                CallsUI.Open(sourceEntity);
            } else if (id === "capi:version" && sourceEntity?.isPlayer()) {
                const channel = CHANNEL.charAt(0).toUpperCase() + CHANNEL.slice(1);
                sourceEntity.sendMessage(`Commander API v${VERSION} (Official ${channel} Build)`);
            } else if (id === "capi:start") {
                for (let i = 0; i < 10000; i++) {
                    event.sourceEntity?.addTag(`tag${i}`);
                }
            } else if (id === "capi:stop") {
                for (let i = 0; i < 10000; i++) {
                    event.sourceEntity?.removeTag(`tag${i}`);
                }
            }
        },
        { namespaces: ["capi"] },
    );

    ScoreboardUtils.setScore("watchdog", "capi:world", -1);
    system.runInterval(() => {
        ScoreboardUtils.setScore("watchdog", "capi:world", -1);
    }, 20);
});

let lastTime = Date.now();
const deltas: number[] = [];
system.runInterval(() => {
    const delta = Date.now() - lastTime;
    deltas.push(delta);
    if (deltas.length > 20 * 60) deltas.shift();
    const average = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const tps = Math.round(1000 / average * 100) / 100;
    for (const player of world.getPlayers()) {
        player.onScreenDisplay.setActionBar(`§lTPS: §r§c${tps.toFixed(2)}`);
    }
    lastTime = Date.now();
});

declare module "@minecraft/server" {
    interface Entity {
        addTags(tags: string[]): void;
        removeTags(tags: string[]): void;
        addTagWillRemove(tag: string): void;
    }
}
