import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import Vector from "lib/Vector.js";
import explosion from "../../scriptevents/explosion.js";

new Test("scriptevent_explosion", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const explosionLocation = Vector.from({
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y + 1),
            z: Math.floor(player.location.z),
        });

        const explosionData = {
            location: explosionLocation.toArray(),
            radius: 2,
        };

        explosion(player, JSON.stringify(explosionData));

        await system.waitTicks(20);

        const isBlockBroke = player.dimension.getBlock(explosionLocation.subtract([0, 2, 0]))?.typeId === "minecraft:air";
        
        if (!isBlockBroke) {
            throw new Error("Block was not broken by the explosion");
        }
    })
    .register();
