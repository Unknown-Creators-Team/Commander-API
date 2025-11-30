import { PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("player_spawn", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ player: evPlayer }: PlayerSpawnAfterEvent) {
                if (evPlayer !== player) return;
                await system.waitTicks(1);

                const hasSpawnTag = player.hasTag(`capi:${config.events.playerSpawn.name}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.playerSpawn.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.playerSpawn.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.playerSpawn.name}_z`);

                if (!hasSpawnTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(`Test Failed: \n\tHas Spawn Tag: ${hasSpawnTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`);
                }

                system.clearRun(timeout);
                resolve(undefined);
            }

            world.afterEvents.playerSpawn.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.playerSpawn.unsubscribe(event);
                reject(new Error("Timeout waiting for playerSpawn event"));
            }, 200);

            // SimulatedPlayerはspawnイベントを自動的にトリガーするため、待つだけ
            player.respawn();
        });
    })
    .register();
