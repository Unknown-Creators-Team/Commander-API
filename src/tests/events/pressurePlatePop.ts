import { PressurePlatePopAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("pressure_plate_pop", "empty")
    .initialize((player) => {
        const dimension = player.dimension;
        const plateLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z) + 2,
        };
        dimension.setBlockType(plateLocation, "minecraft:stone_pressure_plate");
    })
    .run(async (player) => {
        const plateLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z) + 2,
        };

        // まずプレートに乗る
        player.moveToBlock(plateLocation);
        await system.waitTicks(10);

        // プレートから離れる
        const awayLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z) - 2,
        };

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ block }: PressurePlatePopAfterEvent) {
                await system.waitTicks(1);

                const entities = block.dimension.getEntities({ location: block.location, maxDistance: 1 });
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

            world.afterEvents.pressurePlatePop.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.pressurePlatePop.unsubscribe(event);
                reject(new Error("Timeout waiting for pressurePlatePop event"));
            }, 300);

            player.moveToBlock(awayLocation);
        });
    })
    .register();
