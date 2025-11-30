import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_reset_name", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const originalName = player.name;

        // First rename
        player.nameTag = "TempName";
        await system.waitTicks(2);

        // Reset name
        player.runCommand(`scriptevent capi:${config.scriptevents.reset_name.name}`);
        await system.waitTicks(5);

        if (player.nameTag !== originalName) {
            throw new Error(`Test Failed: Expected name "${originalName}", got "${player.nameTag}"`);
        }
    })
    .register();
