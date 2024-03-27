import { GameMode, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { checkUtils } from "./checkUtils";

GameTest.register("commander_api", "blockBreak", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-blockBreak", GameMode.survival);

    await checkUtils.waitOp(player, test);

    world.sendMessage(`§aテストを開始します。`);

    const { block: viewBlock } = player.getBlockFromViewDirection();

    player.breakBlock({ "x": 2, "y": 3, "z": 4 });

    system.runTimeout(() => {
        const hasBreak = player.hasTag("Capi:blockBreak");
        const hasBlockID = player.hasTag(`blockBreak:minecraft:dirt`);

        const scoreX = player.score.get("Capi:blockBreakX") == viewBlock.x;
        const scoreY = player.score.get("Capi:blockBreakY") == viewBlock.y;
        const scoreZ = player.score.get("Capi:blockBreakZ") == viewBlock.z;

        if (hasBreak && hasBlockID && scoreX && scoreY && scoreZ) {
            test.succeed();
        } else {
            test.fail(`すべてのチェックが完了しませんでした: ${hasBreak}, ${hasBlockID}, ${scoreX}, ${scoreY}, ${scoreZ}`);
        }
    }, 20);
})
    .structureName("Capi:test_blockBreak")
    .maxTicks(20 * 30);