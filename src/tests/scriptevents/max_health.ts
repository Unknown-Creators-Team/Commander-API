import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import healthEvent from "../../scriptevents/max_health.js";
import Vector from "lib/Vector.js";

new Test("scriptevent_health", "empty")
    .initialize((player) => {
    })
    .run(async (player) => {
        healthEvent(player, "30");
        await system.waitTicks(5);

        if (player.health !== 30) {
            throw new Error(`Player health expected to be 30, but was ${player.health}`);
        }
    })
    .register();
