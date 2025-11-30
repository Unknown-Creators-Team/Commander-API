import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_get_item", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const container = player.container;
        if (!container) throw new Error("Player container not found");

        // Clear slot
        container.setItem(5, undefined);

        const itemData = {
            id: "minecraft:diamond",
            slot: 5,
        };

        player.runCommand(`scriptevent capi:${config.scriptevents.get_item.name} ${JSON.stringify(itemData)}`);
        await system.waitTicks(5);

        const item = container.getItem(itemData.slot);
        if (!item || item.typeId !== itemData.id) {
            throw new Error(`Test Failed: Expected item "${itemData.id}", got "${item?.typeId}"`);
        }
    })
    .register();
