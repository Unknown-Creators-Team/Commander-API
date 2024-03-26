import { GameMode, system } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

async function testNormal(player: GameTest.SimulatedPlayer) {
    return new Promise((resolve) => {
        player.addTag("rename:test");

        system.runTimeout(() => {
            if (player.nameTag === "test") {
                resolve(true);
            } else {
                resolve(false);
            }
        }, 10);
    });
}

async function testColor(player: GameTest.SimulatedPlayer) {
    return new Promise((resolve) => {
        player.addTag("rename:§atest");

        system.runTimeout(() => {
            if (player.nameTag === "§atest") {
                resolve(true);
            } else {
                resolve(false);
            }
        }, 10);
    });
}

GameTest.registerAsync("commander_api", "rename", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-rename", GameMode.survival);

    const testResult = await testNormal(player);
    const testColorResult = await testColor(player);

    if (testResult && testColorResult) {
        test.succeed();
    } else {
        test.fail(`テストが失敗しました: ${testResult}, ${testColorResult}`);
    }

})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);