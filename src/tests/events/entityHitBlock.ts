import { EntityHitBlockAfterEvent, ItemStack, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("entity_hit_block", "empty")
    .initialize((player) => {
        player.container?.setItem(player.selectedSlotIndex, new ItemStack("minecraft:diamond_sword"));
    })
    .run(async (player) => {
        const dimension = player.dimension;
        const targetLocation = {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z + 2,
        };

        dimension.setBlockType(targetLocation, "minecraft:stone");

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ damagingEntity, hitBlock }: EntityHitBlockAfterEvent) {
                if (!damagingEntity?.isPlayer() || damagingEntity !== player) return;
                await system.waitTicks(1);

                const hasAttackTag = player.hasTag(`capi:${config.events.entityHitBlock.name}`);
                const hasBlockTag = player.hasTag(`${config.events.entityHitBlock.name}:${hitBlock.typeId}`);
                const isScoreEqualX = ScoreboardUtils.getScore(player, `capi:${config.events.entityHitBlock.name}_x`) === hitBlock.x;
                const isScoreEqualY = ScoreboardUtils.getScore(player, `capi:${config.events.entityHitBlock.name}_y`) === hitBlock.y;
                const isScoreEqualZ = ScoreboardUtils.getScore(player, `capi:${config.events.entityHitBlock.name}_z`) === hitBlock.z;

                if (!hasAttackTag || !hasBlockTag || !isScoreEqualX || !isScoreEqualY || !isScoreEqualZ) {
                    throw new Error(
                        `Test Failed: \n\tHas Attack Tag: ${hasAttackTag}\n\tHas Block Tag: ${hasBlockTag}\n\tScore X: ${isScoreEqualX}\n\tScore Y: ${isScoreEqualY}\n\tScore Z: ${isScoreEqualZ}`
                    );
                }

                system.clearRun(timeout);
                resolve(undefined);
            }

            world.afterEvents.entityHitBlock.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.entityHitBlock.unsubscribe(event);
                reject(new Error("Timeout waiting for entityHitBlock event"));
            }, 200);

            player.attack();
        });
    })
    .register();
