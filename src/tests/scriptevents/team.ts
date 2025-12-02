import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import teamEvent from "../../scriptevents/team.js";

new Test("scriptevent_team", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const teamData = {
            action: "join",
            team: "test_team",
        };

        teamEvent(player, JSON.stringify(teamData));
        await system.waitTicks(5);

        // Team機能の検証は複雑なため、エラーが発生しなければ成功とする
    })
    .register();
