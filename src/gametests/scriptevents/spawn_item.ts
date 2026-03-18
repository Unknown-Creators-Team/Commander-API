import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import spawnItemEvent from "../../scriptevents/spawn_item.js";
import { Vec3 } from "@bedrock-oss/bedrock-boost";

new Test("scriptevent_spawn_item", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const dimension = player.dimension;
        const spawnLocation = Vec3.from({
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

        spawnItemEvent(player, JSON.stringify(itemData));
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
