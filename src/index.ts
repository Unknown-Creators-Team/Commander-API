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

import "./NativeCode.js";
import "./lib/Logger.js";

import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";

import tickEvent from "./lib/TickEvent.js";
// import { UI } from "./ui.js";

import "./playground";
import "./events/index.js";
import "./scriptevents/index.js";

const { world, system } = Minecraft;

system.run(() => {
    const msg = [
        "§r",
        "§lCommander API をご利用いただきありがとうございます。§r",
        "§r",
        "このアドオンは Commander API V2 の §l開発版§r です。",
        "予期しないエラーや予告なく仕様が変更される可能性があります。",
        "特別な事情が無い限り、本番環境での使用はお控えください。",
        "§r",
    ].join("\n");
    world.sendMessage(msg);
});

system.beforeEvents.watchdogTerminate.subscribe((beforeWatchdogTerminate) => (beforeWatchdogTerminate.cancel = true));

tickEvent.subscribe("main", ({ currentTick, deltaTime, tps }) => {
    try {
        for (const player of world.getAllPlayers()) {
            if (!player.isValid()) return;

            // tshoot
            if (player.hasTag("Capi:system_tshoot")) {
                player.getTags().forEach((t) => player.removeTag(t));
            }

            if (player.hasTag("Capi:open_config_gui")) {
                // new UI(player).Menu();
            }
        }
    } catch (e) {
        console.error(e, (e as Error).stack);
    }
});
