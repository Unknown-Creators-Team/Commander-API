import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_kick", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        // Note: SimulatedPlayer cannot be kicked, so we just verify the command runs
        const kickMessage = "You have been kicked for testing";

        player.runCommand(`scriptevent capi:${config.scriptevents.kick.name} ${kickMessage}`);
        await system.waitTicks(5);

        // If no error is thrown, the test passes
    })
    .register();
