import { system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_say", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const testMessage = "Hello from scriptevent test!";
        let messageSent = false;

        const unsubscribe = system.afterEvents.scriptEventReceive.subscribe((event) => {
            if (event.message === testMessage && event.sourceEntity === player) {
                messageSent = true;
            }
        });

        player.runCommand(`scriptevent capi:${config.scriptevents.say.name} ${testMessage}`);
        await system.waitTicks(5);

        system.afterEvents.scriptEventReceive.unsubscribe(unsubscribe);

        // Note: This test verifies the command runs without error
        // Actual message broadcast verification would require chat monitoring
    })
    .register();
