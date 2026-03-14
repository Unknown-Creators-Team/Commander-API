import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import knockback from "../../scriptevents/knockback.js";

new Test("scriptevent_knockback", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const originalLocation = { ...player.location };
        const knockbackData = {
            horizontal_force: [2, 2],
            vertical_strength: 1,
        };

        knockback(player, JSON.stringify(knockbackData));
        await system.waitTicks(10);

        const newLocation = player.location;
        const moved =
            Math.abs(newLocation.x - originalLocation.x) > 0.5 ||
            Math.abs(newLocation.y - originalLocation.y) > 0.5 ||
            Math.abs(newLocation.z - originalLocation.z) > 0.5;

        if (!moved) {
            throw new Error(`Test Failed: Player did not move from (${originalLocation.x}, ${originalLocation.y}, ${originalLocation.z})`);
        }
    })
    .register();
