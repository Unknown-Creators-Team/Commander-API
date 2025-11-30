import { ItemStartUseOnAfterEvent, ItemStack, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("item_use_on", "empty")
    .initialize((player) => {
        const item = new ItemStack("minecraft:diamond_pickaxe", 1);
        player.container?.setItem(player.selectedSlotIndex, item);
    })
    .run(async (player) => {
        const item = player.container?.getItem(player.selectedSlotIndex);
        if (!item) throw new Error("Item not found in player inventory");

        const dimension = player.dimension;
        const targetLocation = {
            x: player.location.x,
            y: player.location.y - 1,
            z: player.location.z + 1,
        };
        dimension.setBlockType(targetLocation, "minecraft:stone");

        const itemTypeId = item.typeId;

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ source: evPlayer, block, itemStack }: ItemStartUseOnAfterEvent) {
                if (evPlayer !== player || !itemStack || itemStack.typeId !== itemTypeId) return;
                await system.waitTicks(1);

                const hasItemUseOnTag = player.hasTag(`capi:${config.events.itemUseOn.name}`);
                const hasItemIdTag = player.hasTag(`${config.events.itemUseOn.name}.id:${itemTypeId}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.itemUseOn.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.itemUseOn.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.itemUseOn.name}_z`);

                if (!hasItemUseOnTag || !hasItemIdTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(
                        `Test Failed: \n\tHas Item Use On Tag: ${hasItemUseOnTag}\n\tHas Item ID Tag: ${hasItemIdTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`
                    );
                }

                system.clearRun(timeout);
                resolve(undefined);
            }

            world.afterEvents.itemStartUseOn.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.itemStartUseOn.unsubscribe(event);
                reject(new Error("Timeout waiting for itemUseOn event"));
            }, 200);

            player.interactWithBlock(targetLocation);
        });
    })
    .register();
