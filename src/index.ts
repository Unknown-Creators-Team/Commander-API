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

// import "./NativeCode.js";
// import "./lib/Logger.js";

import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";

import tickEvent from "./lib/TickEvent.js";
import { CallsUI } from "ui/calls.js";
// import { ConfigUI } from "ui/index.js";
// import { UI } from "./ui.js";

// import "./playground";
// import "./events/index.js";
// import "./scriptevents/index.js";
// import("./checks/checkLoader.js");

const { world, system } = Minecraft;

world.afterEvents.worldLoad.subscribe(async () => {
    const config = await import("./data/config.js");
    import("./native.js");
    if (config.default.basic.debug.enabled) await import("./lib/Logger.js");
    import("./playground.js");
    import("./events/index.js");
    import("./scriptevents/index.js");
    import("./tests/index.js");
    // import ("checks/blockBreak.js");
    const { ConfigUI } = await import("./ui/index.js");

    system.run(() => {
        const msg = [
            "§r",
            "§lCommander API をご利用いただきありがとうございます。§r",
            "§r",
            "このアドオンは Commander API V2 の §l§c開発版§r です。",
            "予期しないエラーや予告なく仕様が変更される可能性があります。",
            "特別な事情が無い限り、本番環境での使用はお控えください。",
            "§r",
        ].join("\n");
        world.sendMessage(msg);
    });

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
        { namespaces: ["capi"] }
    );
});
