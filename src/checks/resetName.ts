import { GameMode, system } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

GameTest.registerAsync("commander_api", "resetName", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-resetName", GameMode.survival);

    player.addTag("rename:test");

    system.runTimeout(() => {
        if (player.nameTag !== "test") {
            test.fail(`名前が変更されませんでした。現在の名前: ${player.nameTag}, 予定されている変更後の名前: test`);
            return;
        }

        system.runTimeout(() => {
            player.addTag("resetName");

            system.run(() => {
                if (player.nameTag === player.name) {
                    test.fail(`名前がリセットされませんでした。現在の名前: ${player.nameTag}, 予定されているリセット後の名前: ${player.name}`);
                    return;
                }

                test.succeed();
            });
        });
    }, 20);
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);