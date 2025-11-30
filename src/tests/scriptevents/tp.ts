import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_tp", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const targetLocation = { x: 100, y: 64, z: 100 };
        const message = JSON.stringify({
            location: [targetLocation.x, targetLocation.y, targetLocation.z],
        });

        player.runCommand(`scriptevent capi:${config.scriptevents.tp.name} ${message}`);
        await system.waitTicks(5);

        const currentLocation = player.location;
        const distanceX = Math.abs(currentLocation.x - targetLocation.x);
        const distanceY = Math.abs(currentLocation.y - targetLocation.y);
        const distanceZ = Math.abs(currentLocation.z - targetLocation.z);

        if (distanceX > 1 || distanceY > 1 || distanceZ > 1) {
            throw new Error(
                `Test Failed: Expected location (${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}), got (${currentLocation.x}, ${currentLocation.y}, ${currentLocation.z})`
            );
        }
    })
    .register();
