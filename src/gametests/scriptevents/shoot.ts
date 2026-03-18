import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import shootEvent from "../../scriptevents/shoot.js";
import { Vec3 } from "@bedrock-oss/bedrock-boost";

new Test("scriptevent_shoot", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const originalLocation = { ...player.location };
        const shootData = {
            id: "minecraft:arrow",
            location: Vec3.from(originalLocation).add([0, 10, 0]).toArray(),
            vector: [0, -1, 0]
        };
        player.teleport(Vec3.from(originalLocation).add([0, 1000, 0]));

        const beforeCount = player.dimension.getEntities({ type: "minecraft:arrow", location: originalLocation, maxDistance: 10 }).length;

        shootEvent(player, JSON.stringify(shootData));
        await system.waitTicks(20);

        const afterCount = player.dimension.getEntities({ type: "minecraft:arrow", location: originalLocation, maxDistance: 10 }).length;

        if (afterCount <= beforeCount) {
            throw new Error(`Test Failed: Projectile was not shot (before: ${beforeCount}, after: ${afterCount})`);
        }
    })
    .register();
