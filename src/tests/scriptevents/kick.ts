import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import kick from "../../scriptevents/kick.js";

new Test("scriptevent_kick", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        // Note: SimulatedPlayer cannot be kicked, so we just verify the command runs
        const kickMessage = "You have been kicked for testing";

        kick(player, kickMessage);
        await system.waitTicks(5);
    })
    .register();
