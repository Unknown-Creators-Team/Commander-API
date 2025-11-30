import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_form", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const formData = {
            type: "message",
            title: "Test Form",
            body: "This is a test form",
        };

        // Note: SimulatedPlayer cannot interact with forms, so we just verify the command runs
        player.runCommand(`scriptevent capi:${config.scriptevents.form.name} ${JSON.stringify(formData)}`);
        await system.waitTicks(5);

        // If no error is thrown, the test passes
    })
    .register();
