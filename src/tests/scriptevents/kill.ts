import { system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_kill", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        let died = false;

        const unsubscribe = world.afterEvents.entityDie.subscribe((event) => {
            if (event.deadEntity === player) {
                died = true;
            }
        });

        player.runCommand(`scriptevent capi:${config.scriptevents.kill.name}`);
        await system.waitTicks(10);

        world.afterEvents.entityDie.unsubscribe(unsubscribe);

        if (!died) {
            throw new Error("Test Failed: Player did not die");
        }
    })
    .register();
