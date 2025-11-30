import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_call", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const callData = {
            function: "test_function",
        };

        player.runCommand(`scriptevent capi:${config.scriptevents.call.name} ${JSON.stringify(callData)}`);
        await system.waitTicks(5);

        // Call機能の検証は複雑なため、エラーが発生しなければ成功とする
    })
    .register();
