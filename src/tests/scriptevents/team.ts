import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import teamEvent from "../../scriptevents/team.js";

new Test("scriptevent_team", "empty")
    .initialize((player) => {})
    .run(async (player) => {

        teamEvent(player, "2");
        await system.waitTicks(5);
    })
    .register();
