import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_rename", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const originalName = player.name;
        const newName = "TestPlayer_" + Math.random().toString(36).substring(2, 7);

        player.runCommand(`scriptevent capi:${config.scriptevents.rename.name} ${newName}`);
        await system.waitTicks(5);

        if (player.nameTag !== newName) {
            throw new Error(`Test Failed: Expected name "${newName}", got "${player.nameTag}"`);
        }
    })
    .register();
