import { PlayerInteractWithEntityAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("player_interact_with_entity", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const dimension = player.dimension;
        const spawnLocation = {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z + 1,
        };

        const entity = dimension.spawnEntity("minecraft:villager", spawnLocation);

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ player: evPlayer, target }: PlayerInteractWithEntityAfterEvent) {
                if (evPlayer !== player || target !== entity) return;
                await system.waitTicks(1);

                const hasInteractTag = player.hasTag(`capi:${config.events.playerInteractWithEntity.name}`);
                const hasEntityTag = player.hasTag(`${config.events.playerInteractWithEntity.name}:${entity.typeId}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.playerInteractWithEntity.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.playerInteractWithEntity.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.playerInteractWithEntity.name}_z`);

                if (!hasInteractTag || !hasEntityTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(
                        `Test Failed: \n\tHas Interact Tag: ${hasInteractTag}\n\tHas Entity Tag: ${hasEntityTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`
                    );
                }

                world.afterEvents.playerInteractWithEntity.unsubscribe(event);
                system.clearRun(timeout);
                entity.remove();
                resolve(undefined);
            }

            world.afterEvents.playerInteractWithEntity.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.playerInteractWithEntity.unsubscribe(event);
                entity.remove();
                reject(new Error("Timeout waiting for playerInteractWithEntity event"));
            }, 200);

            player.interactWithEntity(entity);
        });
    })
    .register();
