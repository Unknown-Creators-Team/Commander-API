import { GameMode, Player, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

GameTest.registerAsync("commander_api", "setSlot", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-setSlot", GameMode.survival);

    test.startSequence()
        .thenExecuteAfter(10, () => {
            player.runCommand("scoreboard players set @s Capi:setSlot 4");
        })
        .thenExecuteAfter(5, () => {
            if (player.selectedSlot !== 4) {
                test.fail(`スロットが一致しませんでした。予定されているスロット: 4, 現在のスロット: ${player.selectedSlot}`);
                return;
            }
        })
        .thenSucceed();
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);