import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_set_slot", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const targetSlot = 3;

        player.runCommand(`scriptevent capi:${config.scriptevents.set_slot.name} ${targetSlot}`);
        await system.waitTicks(5);

        if (player.selectedSlotIndex !== targetSlot) {
            throw new Error(`Test Failed: Expected slot ${targetSlot}, got ${player.selectedSlotIndex}`);
        }
    })
    .register();
