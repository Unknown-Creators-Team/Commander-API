import { ItemUseAfterEvent, ItemStack, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("item_use", "empty")
    .initialize((player) => {
        const item = new ItemStack("minecraft:apple", 1);
        player.container?.setItem(player.selectedSlotIndex, item);
    })
    .run(async (player) => {
        const item = player.container?.getItem(player.selectedSlotIndex);
        if (!item) throw new Error("Item not found in player inventory");

        const itemTypeId = item.typeId;

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ source: evPlayer, itemStack }: ItemUseAfterEvent) {
                if (evPlayer !== player || itemStack.typeId !== itemTypeId) return;
                await system.waitTicks(1);

                const hasItemUseTag = player.hasTag(`capi:${config.events.itemUse.name}`);
                const hasItemIdTag = player.hasTag(`${config.events.itemUse.name}.id:${itemTypeId}`);

                if (!hasItemUseTag || !hasItemIdTag) {
                    throw new Error(`Test Failed: \n\tHas Item Use Tag: ${hasItemUseTag}\n\tHas Item ID Tag: ${hasItemIdTag}`);
                }

                system.clearRun(timeout);
                resolve(undefined);
            }

            world.afterEvents.itemUse.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.itemUse.unsubscribe(event);
                reject(new Error("Timeout waiting for itemUse event"));
            }, 200);

            player.useItem(item);
        });
    })
    .register();
