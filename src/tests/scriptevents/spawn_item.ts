import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";
import Vector from "lib/Vector.js";

new Test("scriptevent_spawn_item", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const dimension = player.dimension;
        const spawnLocation = Vector.from({
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y + 1),
            z: Math.floor(player.location.z),
        });
        player.teleport(spawnLocation.add([0, 1000, 0]));

        const itemData = {
            item: "minecraft:diamond",
            amount: 5,
            location: [spawnLocation.x, spawnLocation.y, spawnLocation.z],
        };

        const beforeCount = dimension.getEntities({ type: "minecraft:item", location: spawnLocation, maxDistance: 3 }).length;

        player.runCommand(`scriptevent capi:${config.scriptevents.spawn_item.name} ${JSON.stringify(itemData)}`);
        await system.waitTicks(5);

        const afterCount = dimension.getEntities({ type: "minecraft:item", location: spawnLocation, maxDistance: 3 }).length;

        if (afterCount <= beforeCount) {
            throw new Error(`Test Failed: Item entity was not spawned (before: ${beforeCount}, after: ${afterCount})`);
        }

        // Cleanup
        const items = dimension.getEntities({ type: "minecraft:item", location: spawnLocation, maxDistance: 3 });
        items.forEach((e) => e.remove());
    })
    .register();
