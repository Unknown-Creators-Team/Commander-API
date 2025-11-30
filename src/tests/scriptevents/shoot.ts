import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_shoot", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const shootData = {
            id: "minecraft:arrow",
        };

        const beforeCount = player.dimension.getEntities({ type: "minecraft:arrow", location: player.location, maxDistance: 10 }).length;

        player.runCommand(`scriptevent capi:${config.scriptevents.shoot.name} ${JSON.stringify(shootData)}`);
        await system.waitTicks(5);

        const afterCount = player.dimension.getEntities({ type: "minecraft:arrow", location: player.location, maxDistance: 10 }).length;

        if (afterCount <= beforeCount) {
            throw new Error(`Test Failed: Projectile was not shot (before: ${beforeCount}, after: ${afterCount})`);
        }
    })
    .register();
