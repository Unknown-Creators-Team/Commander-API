import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_explosion", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const explosionLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z + 5),
        };

        const explosionData = {
            location: [explosionLocation.x, explosionLocation.y, explosionLocation.z],
            radius: 2,
        };

        player.runCommand(`scriptevent capi:${config.scriptevents.explosion.name} ${JSON.stringify(explosionData)}`);
        await system.waitTicks(5);

        // エラーが発生しなければ成功
    })
    .register();
