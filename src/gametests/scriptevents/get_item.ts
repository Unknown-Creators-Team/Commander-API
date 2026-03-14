import { ItemStack, system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";
import getItem from "../../scriptevents/get_item.js";

new Test("scriptevent_get_item", "empty")
    .initialize((player) => {
        const item = new ItemStack("minecraft:diamond", 1);
        player.container?.setItem(player.selectedSlotIndex, item);
    })
    .run(async (player) => {
        const container = player.container;
        if (!container) throw new Error("Player container not found");

        getItem(player, "");
        await system.waitTicks(1);

        const hasItemTag = player.hasTag(`capi:${config.scriptevents.get_item.name}`);

        if (!hasItemTag) {
            throw new Error(`Test Failed: Player does not have the expected tag for get_item scriptevent`);
        }
    })
    .register();
