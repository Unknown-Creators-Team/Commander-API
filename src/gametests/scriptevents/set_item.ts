import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import setItemEvent from "../../scriptevents/set_item.js";

new Test("scriptevent_set_item", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const itemData = {
            id: "minecraft:diamond_sword",
            amount: 1,
            name: "Test Sword",
            slot: 0,
        };

        setItemEvent(player, JSON.stringify(itemData));
        await system.waitTicks(5);

        const container = player.container;
        if (!container) throw new Error("Player container not found");

        const item = container.getItem(itemData.slot);
        if (!item || item.typeId !== itemData.id) {
            throw new Error(`Test Failed: Expected item "${itemData.id}", got "${item?.typeId}"`);
        }

        if (item.nameTag !== itemData.name) {
            throw new Error(`Test Failed: Expected name "${itemData.name}", got "${item.nameTag}"`);
        }
    })
    .register();
