import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import setSlotEvent from "../../scriptevents/set_slot.js";

new Test("scriptevent_set_slot", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const targetSlot = 3;

        setSlotEvent(player, `${targetSlot}`);
        await system.waitTicks(5);

        if (player.selectedSlotIndex !== targetSlot) {
            throw new Error(`Test Failed: Expected slot ${targetSlot}, got ${player.selectedSlotIndex}`);
        }
    })
    .register();
