import { EntityHurtAfterEvent, ItemStack, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";

new Test("entity_hurt", "empty")
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
            async function event({ damageSource, hurtEntity }: EntityHurtAfterEvent) {
                if (hurtEntity !== entity) return;
                const attacker = damageSource.damagingEntity;
                if (!attacker?.isPlayer() || attacker !== player) return;

                await system.waitTicks(1);

                const hasDamageTag = player.hasTag("capi:damage");
                const damageScore = ScoreboardUtils.getScore(player, "capi:damage");
                const scoreX = ScoreboardUtils.getScore(player, "capi:damage_x");
                const scoreY = ScoreboardUtils.getScore(player, "capi:damage_y");
                const scoreZ = ScoreboardUtils.getScore(player, "capi:damage_z");
                const hasCauseTag = player.getTags().some((tag) => tag.startsWith("damage_cause:"));

                if (
                    !hasDamageTag ||
                    damageScore === undefined ||
                    scoreX === undefined ||
                    scoreY === undefined ||
                    scoreZ === undefined ||
                    !hasCauseTag
                ) {
                    throw new Error(
                        `Test Failed: \n\tHas Damage Tag: ${hasDamageTag}\n\tDamage Score: ${damageScore}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})\n\tHas Cause Tag: ${hasCauseTag}`
                    );
                }

                world.afterEvents.entityHurt.unsubscribe(event);
                system.clearRun(timeout);
                entity.remove();
                resolve(undefined);
            }

            world.afterEvents.entityHurt.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.entityHurt.unsubscribe(event);
                entity.remove();
                reject(new Error("Timeout waiting for entityHurt event"));
            }, 200);

            player.attackEntity(entity);
        });
    })
    .register();
