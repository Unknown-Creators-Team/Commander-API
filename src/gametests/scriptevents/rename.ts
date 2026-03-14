import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import rename from "../../scriptevents/rename.js";

new Test("scriptevent_rename", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const newName = "TestPlayer_" + Math.random().toString(36).substring(2, 7);

        rename(player, newName);
        await system.waitTicks(5);

        if (player.nameTag !== newName) {
            throw new Error(`Test Failed: Expected name "${newName}", got "${player.nameTag}"`);
        }
    })
    .register();
