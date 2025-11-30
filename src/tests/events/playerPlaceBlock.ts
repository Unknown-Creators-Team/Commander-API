import { ItemStack, PlayerPlaceBlockAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("player_place_block", "empty")
    .initialize((player) => {
        const item = new ItemStack("minecraft:stone", 64);
        player.container?.setItem(player.selectedSlotIndex, item);
    })
    .run(async (player) => {
        const targetLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z) + 2,
        };

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ player: evPlayer, block }: PlayerPlaceBlockAfterEvent) {
                if (evPlayer !== player) return;
                await system.waitTicks(1);

                const hasPlaceTag = player.hasTag(`capi:${config.events.playerPlaceBlock.name}`);
                const hasBlockTag = player.hasTag(`${config.events.playerPlaceBlock.name}:${block.typeId}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.playerPlaceBlock.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.playerPlaceBlock.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.playerPlaceBlock.name}_z`);

                if (!hasPlaceTag || !hasBlockTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(
                        `Test Failed: \n\tHas Place Tag: ${hasPlaceTag}\n\tHas Block Tag: ${hasBlockTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`
                    );
                }

                system.clearRun(timeout);
                resolve(undefined);
            }

            world.afterEvents.playerPlaceBlock.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.playerPlaceBlock.unsubscribe(event);
                reject(new Error("Timeout waiting for playerPlaceBlock event"));
            }, 200);

            const item = player.container?.getItem(player.selectedSlotIndex);
            if (item) {
                player.useItemOnBlock(item, targetLocation);
            }
        });
    })
    .register();
