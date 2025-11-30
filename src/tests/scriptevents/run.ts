import { system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_run", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const testTag = "test_run_tag_" + Math.random().toString(36).substring(2, 7);
        const command = `tag @s add ${testTag}`;

        player.runCommand(`scriptevent capi:${config.scriptevents.run.name} ${command}`);
        await system.waitTicks(5);

        if (!player.hasTag(testTag)) {
            throw new Error(`Test Failed: Tag "${testTag}" was not added to player`);
        }

        player.removeTag(testTag);
    })
    .register();
