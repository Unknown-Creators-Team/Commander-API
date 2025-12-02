import { EntityHitEntityAfterEvent, ItemStack, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("entity_hit_entity", "empty")
    .initialize((player) => {
        player.container?.setItem(player.selectedSlotIndex, new ItemStack("minecraft:diamond_sword"));
    })
    .run(async (player) => {
        const dimension = player.dimension;
        const spawnLocation = {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z + 1,
        };

        const entity = dimension.spawnEntity("minecraft:cow", spawnLocation);

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ damagingEntity, hitEntity }: EntityHitEntityAfterEvent) {
                if (!damagingEntity?.isPlayer() || damagingEntity !== player || hitEntity !== entity) return;
                await system.waitTicks(1);

                const hasAttackTag = player.hasTag(`capi:${config.events.entityHitEntity.name}`);
                const hasEntityTag = player.hasTag(`${config.events.entityHitEntity.name}:${entity.typeId}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.entityHitEntity.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.entityHitEntity.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.entityHitEntity.name}_z`);

                if (!hasAttackTag || !hasEntityTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(
                        `Test Failed: \n\tHas Attack Tag: ${hasAttackTag}\n\tHas Entity Tag: ${hasEntityTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`
                    );
                }

                world.afterEvents.entityHitEntity.unsubscribe(event);
                system.clearRun(timeout);
                entity.remove();
                resolve(undefined);
            }

            world.afterEvents.entityHitEntity.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.entityHitEntity.unsubscribe(event);
                entity.remove();
                reject(new Error("Timeout waiting for entityHitEntity event"));
            }, 200);

            player.attackEntity(entity);
        });
    })
    .register();
