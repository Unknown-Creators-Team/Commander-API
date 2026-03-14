import { ItemStack, ProjectileHitBlockAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "script-box-mc";
import config from "data/config.js";

new Test("projectile_hit_block", "empty")
    .initialize((player) => {
        const item = new ItemStack("minecraft:snowball", 64);
        player.container?.setItem(player.selectedSlotIndex, item);
    })
    .run(async (player) => {
        const dimension = player.dimension;
        const targetLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y) + 1,
            z: Math.floor(player.location.z) + 3,
        };
        dimension.setBlockType(targetLocation, "minecraft:stone");

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event(ev: ProjectileHitBlockAfterEvent) {
                const { projectile, source } = ev;
                if (!source?.isPlayer() || source !== player) return;
                await system.waitTicks(1);

                const { block } = ev.getBlockHit();

                const hasHitTag = player.hasTag(`capi:${config.events.projectileHitBlock.name}`);
                const hasWithTag = player.hasTag(`${config.events.projectileHitBlock.name}.with:${projectile.typeId}`);
                const hasToTag = player.hasTag(`${config.events.projectileHitBlock.name}.to:${block.typeId}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.projectileHitBlock.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.projectileHitBlock.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.projectileHitBlock.name}_z`);

                if (!hasHitTag || !hasWithTag || !hasToTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(
                        `Test Failed: \n\tHas Hit Tag: ${hasHitTag}\n\tHas With Tag: ${hasWithTag}\n\tHas To Tag: ${hasToTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`,
                    );
                }

                world.afterEvents.projectileHitBlock.unsubscribe(event);
                system.clearRun(timeout);
                resolve(undefined);
            }

            world.afterEvents.projectileHitBlock.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.projectileHitBlock.unsubscribe(event);
                reject(new Error("Timeout waiting for projectileHitBlock event"));
            }, 200);

            const item = player.container?.getItem(player.selectedSlotIndex);
            if (item) {
                player.useItem(item);
            }
        });
    })
    .register();
