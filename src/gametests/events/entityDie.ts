import { EntityDieAfterEvent, ItemStack, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "script-box-mc";

new Test("entity_die", "empty")
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
        await new Promise(async (resolve, reject) => {
            async function event({ deadEntity, damageSource }: EntityDieAfterEvent) {
                if (deadEntity !== entity) return;
                const killer = damageSource.damagingEntity;
                if (!killer?.isPlayer() || killer !== player) return;

                await system.waitTicks(1);

                const killCount = ScoreboardUtils.getScore(player, "capi:kill");
                const hasKillTag = player.hasTag("capi:kill");
                const killX = Math.abs(ScoreboardUtils.getScore(player, "capi:kill_x") ?? spawnLocation.x + 3 - spawnLocation.x) < 3;
                const killY = Math.abs(ScoreboardUtils.getScore(player, "capi:kill_y") ?? spawnLocation.y + 3 - spawnLocation.y) < 3;
                const killZ = Math.abs(ScoreboardUtils.getScore(player, "capi:kill_z") ?? spawnLocation.z + 3 - spawnLocation.z) < 3;
                const hasCauseTag = player.getTags().some((tag) => tag.startsWith("die_cause:"));

                if (!hasKillTag || killCount === undefined || killX === undefined || killY === undefined || killZ === undefined || !hasCauseTag) {
                    throw new Error(
                        `Test Failed: \n\tHas Kill Tag: ${hasKillTag}\n\tKill Count: ${killCount}\n\tKill Location: (${killX}, ${killY}, ${killZ})\n\tHas Cause Tag: ${hasCauseTag}`,
                    );
                }

                world.afterEvents.entityDie.unsubscribe(event);
                system.clearRun(timeout);
                resolve(undefined);
            }
            world.afterEvents.entityDie.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.entityDie.unsubscribe(event);
                entity.remove();
                reject(new Error("Timeout waiting for entityDie event. Please kill the spawned zombie."));
            }, 200);

            while (entity.isValid && player.isValid) {
                player.attackEntity(entity);
                await system.waitTicks(10);
            }
        });
    })
    .register();
