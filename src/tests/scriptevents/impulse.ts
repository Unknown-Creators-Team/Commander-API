import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_impulse", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const originalLocation = { ...player.location };
        const impulseData = {
            vector: [0, 2, 0],
        };
        
        const entity = player.dimension.spawnEntity("minecraft:cow", originalLocation);

        entity.runCommand(`scriptevent capi:${config.scriptevents.impulse.name} ${JSON.stringify(impulseData)}`);
        await system.waitTicks(10);

        const newLocation = entity.location;
        const moved = Math.abs(newLocation.y - originalLocation.y) > 0.5;

        if (!moved) {
            throw new Error(`Test Failed: Player did not move vertically from ${originalLocation.y} to ${newLocation.y}`);
        }
    })
    .register();
