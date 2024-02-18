import { GameMode, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

GameTest.register("commander_api", "beforeChat", (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-beforeChat", GameMode.survival);

    system.runTimeout(() => {
        player.chat("TestChat");

        system.runTimeout(() => {
            if (player.hasTag("chat:TestChat")) {
                test.succeed();
            } else {
                test.fail("チャット検知タグが付与されていませんでした。");
            }
        }, 10);
    }, 20);
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);