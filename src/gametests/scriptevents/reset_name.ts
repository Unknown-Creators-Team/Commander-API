import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import resetName from "../../scriptevents/reset_name.js";

new Test("scriptevent_reset_name", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const originalName = player.name;

        // First rename
        player.nameTag = "TempName";
        await system.waitTicks(2);

        // Reset name (call original scriptevent function)
        resetName(player, "");
        await system.waitTicks(5);

        if (player.nameTag !== originalName) {
            throw new Error(`Test Failed: Expected name "${originalName}", got "${player.nameTag}"`);
        }
    })
    .register();
