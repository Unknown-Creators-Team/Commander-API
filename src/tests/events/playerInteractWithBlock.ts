import { PlayerInteractWithBlockAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("player_interact_with_block", "button_push")
    .initialize((player) => {
        // const dimension = player.dimension;
        // const targetLocation = {
        //     x: player.location.x,
        //     y: player.location.y + 1,
        //     z: player.location.z + 1,
        // };
        // dimension.setBlockType(targetLocation, "minecraft:crafting_table");
    })
    .run(async (player) => {
        // const targetLocation = {
        //     x: player.location.x,
        //     y: player.location.y,
        //     z: player.location.z + 1,
        // };

        let timeout: number;
        await new Promise(async (resolve, reject) => {
            async function event({ player: evPlayer, block }: PlayerInteractWithBlockAfterEvent) {

                console.warn("Hi");
                if (evPlayer !== player) return;
                await system.waitTicks(1);

                const hasInteractTag = player.hasTag(`capi:${config.events.playerInteractWithBlock.name}`);
                const hasBlockTag = player.hasTag(`${config.events.playerInteractWithBlock.name}:${block.typeId}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.playerInteractWithBlock.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.playerInteractWithBlock.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.playerInteractWithBlock.name}_z`);

                if (!hasInteractTag || !hasBlockTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(
                        `Test Failed: \n\tHas Interact Tag: ${hasInteractTag}\n\tHas Block Tag: ${hasBlockTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`
                    );
                }

                world.afterEvents.playerInteractWithBlock.unsubscribe(event);
                system.clearRun(timeout);
                resolve(undefined);
            }

            world.afterEvents.playerInteractWithBlock.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.playerInteractWithBlock.unsubscribe(event);
                reject(new Error("Timeout waiting for playerInteractWithBlock event"));
            }, 200);

            await system.waitTicks(1);

            // console.warn(player.interactWithBlock({x: 2, y: 3, z: 3}));
            player.interact();
        });
    })
    .register();
