import { GameMode, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

GameTest.register("commander_api", "blockBreak", (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-blockBreak", GameMode.survival);

    world.sendMessage(`§a${player.name} §bにOP権限を付与してください。`);

    let time = 0;

    const i = system.runInterval(() => {
        if (player.isOp()) {
            system.clearRun(i);

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
        } else {
            time++;

            if (time > 10) {
                test.fail(`権限が付与されませんでした。`);

                system.clearRun(i);
            }
        }
    }, 20);
})
    .structureName("Capi:test_blockBreak")
    .maxTicks(20 * 30);