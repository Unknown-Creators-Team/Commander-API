import { GameMode, ItemStack } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { Sequence } from "./Sequence/Sequence";

const DIRT_ITEMSTACK = new ItemStack("minecraft:dirt");

GameTest.registerAsync("commander_api", "join", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 2, "z": 2 }, "Test-join", GameMode.survival);
    const sequence = new Sequence(test);

    sequence
        .addWait("10tickの待機", 10)
        .addSequence("タグのチェック", () => {
            const hasJoinTag = player.hasTag("Capi:join");
            const joinCount = player.score.get("Capi:joinCount");
            const playerJoinX = player.score.get("Capi:playerJoinX");
            const playerJoinY = player.score.get("Capi:playerJoinY");
            const playerJoinZ = player.score.get("Capi:playerJoinZ");

            if (
                hasJoinTag &&
                joinCount === 1 &&
                playerJoinX === Math.floor(player.location.x) &&
                playerJoinY === Math.floor(player.location.y) &&
                playerJoinZ === Math.floor(player.location.z)
            ) {
                return true;
            }

            return { reason: `チェックが失敗しました: ${hasJoinTag}, ${joinCount}, ${playerJoinX}, ${playerJoinY}, ${playerJoinZ}` };
        }, 0, true)

        .run();
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);