import { TripWireTripAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("trip_wire_trip", "empty")
    .initialize((player) => {
        const dimension = player.dimension;
        const tripWireLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z) + 2,
        };
        dimension.setBlockType(tripWireLocation, "minecraft:tripwire");
    })
    .run(async (player) => {
        const tripWireLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z) + 2,
        };

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ block, sources }: TripWireTripAfterEvent) {
                const hasPlayer = sources.some((entity) => entity.isPlayer() && entity === player);
                if (!hasPlayer) return;

                await system.waitTicks(1);

                const hasTripTag = player.hasTag(`capi:${config.events.tripWireTrip.name}`);
                const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.tripWireTrip.name}_x`);
                const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.tripWireTrip.name}_y`);
                const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.tripWireTrip.name}_z`);

                if (!hasTripTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
                    throw new Error(`Test Failed: \n\tHas Trip Tag: ${hasTripTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`);
                }

                system.clearRun(timeout);
                resolve(undefined);
            }

            world.afterEvents.tripWireTrip.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.tripWireTrip.unsubscribe(event);
                reject(new Error("Timeout waiting for tripWireTrip event"));
            }, 200);

            player.moveToBlock(tripWireLocation);
        });
    })
    .register();
