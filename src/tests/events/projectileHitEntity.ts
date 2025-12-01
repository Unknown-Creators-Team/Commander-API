import { ItemStack, ProjectileHitEntityAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("projectile_hit_entity", "empty")
    .initialize((player) => {
        const item = new ItemStack("minecraft:snowball", 64);
        player.container?.setItem(player.selectedSlotIndex, item);
    })
    .run(async (player) => {
        const dimension = player.dimension;
        const spawnLocation = {
            x: player.location.x,
            y: player.location.y + 1,
            z: player.location.z + 1,
        };

        const entity = dimension.spawnEntity("minecraft:cow", spawnLocation);

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event(ev: ProjectileHitEntityAfterEvent) {
                const { projectile, source } = ev;
                if (!source?.isPlayer() || source !== player) return;

                const { entity: hitEntity } = ev.getEntityHit();
                if (!hitEntity || hitEntity !== entity) return;

                await system.waitTicks(1);

                const hasHitTag = player.hasTag(`capi:${config.events.projectileHitEntity.name}`);
                const hasWithTag = player.hasTag(`${config.events.projectileHitEntity.name}.with:${projectile.typeId}`);
                const hasToTag = player.hasTag(`${config.events.projectileHitEntity.name}.to:${hitEntity.typeId}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.projectileHitEntity.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.projectileHitEntity.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.projectileHitEntity.name}_z`);

                if (!hasHitTag || !hasWithTag || !hasToTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(
                        `Test Failed: \n\tHas Hit Tag: ${hasHitTag}\n\tHas With Tag: ${hasWithTag}\n\tHas To Tag: ${hasToTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`
                    );
                }

                system.clearRun(timeout);
                entity.remove();
                resolve(undefined);
            }

            world.afterEvents.projectileHitEntity.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.projectileHitEntity.unsubscribe(event);
                entity.remove();
                reject(new Error("Timeout waiting for projectileHitEntity event"));
            }, 200);

            const item = player.container?.getItem(player.selectedSlotIndex);
            if (item) {
                player.useItem(item);
            }
        });
    })
    .register();
