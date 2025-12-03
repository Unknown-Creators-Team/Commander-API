import { PressurePlatePushAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("pressure_plate_push", "empty")
    .initialize((player) => {
        const dimension = player.dimension;
        const plateLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z) + 1,
        };
        dimension.setBlockType(plateLocation, "minecraft:stone_pressure_plate");
    })
    .run(async (player) => {
        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ source: evPlayer, block }: PressurePlatePushAfterEvent) {
                if (!evPlayer?.isPlayer() || evPlayer !== player) return;
                await system.waitTicks(1);

                const hasPlateTag = player.hasTag(`capi:${config.events.pressurePlatePush.name}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.pressurePlatePush.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.pressurePlatePush.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.pressurePlatePush.name}_z`);

                if (!hasPlateTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(`Test Failed: \n\tHas Plate Tag: ${hasPlateTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`);
                }

                world.afterEvents.pressurePlatePush.unsubscribe(event);
                system.clearRun(timeout);
                resolve(undefined);
            }

            world.afterEvents.pressurePlatePush.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.pressurePlatePush.unsubscribe(event);
                reject(new Error("Timeout waiting for pressurePlatePush event"));
            }, 200);

            player.move(0, 1);
        });
    })
    .register();
