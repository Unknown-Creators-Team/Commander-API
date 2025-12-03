import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import spawnEntityEvent from "../../scriptevents/spawn_entity.js";

new Test("scriptevent_spawn_entity", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const spawnLocation = {
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z + 3),
        };

        const spawnData = {
            id: "minecraft:pig",
            name: "Test Pig",
            location: [spawnLocation.x, spawnLocation.y, spawnLocation.z],
        };

        const beforeCount = player.dimension.getEntities({ type: "minecraft:pig", location: spawnLocation, maxDistance: 5 }).length;

        spawnEntityEvent(player, JSON.stringify(spawnData));
        await system.waitTicks(5);

        const afterCount = player.dimension.getEntities({ type: "minecraft:pig", location: spawnLocation, maxDistance: 5 }).length;

        if (afterCount <= beforeCount) {
            throw new Error(`Test Failed: Entity was not spawned (before: ${beforeCount}, after: ${afterCount})`);
        }

        // Cleanup
        const entities = player.dimension.getEntities({ type: "minecraft:pig", location: spawnLocation, maxDistance: 5 });
        entities.forEach((e) => {
            if (e.nameTag === spawnData.name) e.remove();
        });
    })
    .register();
