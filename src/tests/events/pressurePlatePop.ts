import { PressurePlatePopAfterEvent, PressurePlatePushAfterEvent, system, world, WorldAfterEvents } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("pressure_plate_pop", "empty")
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
            async function event({ block }: PressurePlatePopAfterEvent) {
                world.sendMessage("pop");
                await system.waitTicks(1);

                const entities = block.dimension.getEntities({ location: block.location, maxDistance: 1.5 });
                const nearbyPlayer = entities.find((e) => e.isPlayer() && e.id === player.id);

                if (!nearbyPlayer) return;

                const hasPlateTag = player.hasTag(`capi:${config.events.pressurePlatePop.name}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.pressurePlatePop.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.pressurePlatePop.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.pressurePlatePop.name}_z`);

                if (!hasPlateTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(`Test Failed: \n\tHas Plate Tag: ${hasPlateTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`);
                }

                system.clearRun(timeout);
                resolve(undefined);
            }

            // 踏んだあとに戻るため
            async function pushEvent({ source: evPlayer }: PressurePlatePushAfterEvent) {
                if (evPlayer.id === player.id) {
                    player.move(0, -1);
                    await system.waitTicks(3);
                    player.stopMoving();
                }
            }

            world.afterEvents.pressurePlatePop.subscribe(event);
            world.afterEvents.pressurePlatePush.subscribe(pushEvent);
            timeout = system.runTimeout(() => {
                world.afterEvents.pressurePlatePop.unsubscribe(event);
                world.afterEvents.pressurePlatePush.unsubscribe(pushEvent);
                reject(new Error("Timeout waiting for pressurePlatePop event"));
            }, 300);

            player.move(0, 1);
        });
    })
    .register();
