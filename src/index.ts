/**
 *
 * ░█████╗░░█████╗░███╗░░░███╗███╗░░░███╗░█████╗░███╗░░██╗██████╗░███████╗██████╗░  ░█████╗░██████╗░██╗
 * ██╔══██╗██╔══██╗████╗░████║████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝██╔══██╗  ██╔══██╗██╔══██╗██║
 * ██║░░╚═╝██║░░██║██╔████╔██║██╔████╔██║███████║██╔██╗██║██║░░██║█████╗░░██████╔╝  ███████║██████╔╝██║
 * ██║░░██╗██║░░██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚████║██║░░██║██╔══╝░░██╔══██╗  ██╔══██║██╔═══╝░██║
 * ╚█████╔╝╚█████╔╝██║░╚═╝░██║██║░╚═╝░██║██║░░██║██║░╚███║██████╔╝███████╗██║░░██║  ██║░░██║██║░░░░░██║
 * ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░╚══════╝╚═╝░░╚═╝  ╚═╝░░╚═╝╚═╝░░░░░╚═╝
 *
 * @LICENSE GNU General Public License v3.0
 * @AUTHORS Nano, arutaka
 * @LINK https://github.com/191225/Commander-API
 */

import * as Minecraft from "@minecraft/server";
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
            }
            if (id === "capi:calls" && sourceEntity?.isPlayer()) {
                CallsUI.Open(sourceEntity);
            }
        },
        { namespaces: ["capi"] },
    );

    ScoreboardUtils.setScore("watchdog", "capi:world", -1);
    system.runInterval(() => {
        ScoreboardUtils.setScore("watchdog", "capi:world", -1);
    }, 20);
});

declare module "@minecraft/server" {
    interface Entity {
        addTags(tags: string[]): void;
        removeTags(tags: string[]): void;
        addTagWillRemove(tag: string): void;
    }
}