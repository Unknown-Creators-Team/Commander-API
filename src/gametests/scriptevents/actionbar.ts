import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import actionbar from "../../scriptevents/actionbar.js";

new Test("scriptevent_actionbar", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        actionbar(player, "Actionbar test message");

        await system.waitTicks(3);
    })
    .register();
