import { system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import kill from "../../scriptevents/kill.js";

new Test("scriptevent_kill", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        let died = false;

        const unsubscribe = world.afterEvents.entityDie.subscribe((event) => {
            if (event.deadEntity === player) {
                died = true;
            }
        });

        kill(player, "");
        await system.waitTicks(10);

        world.afterEvents.entityDie.unsubscribe(unsubscribe);

        if (!died) {
            throw new Error("Test Failed: Player did not die");
        }
    })
    .register();
