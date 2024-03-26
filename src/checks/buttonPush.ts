import { GameMode, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

GameTest.register("commander_api", "buttonPush", (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-buttonPush", GameMode.survival);

    world.sendMessage(`§a${player.name} §bにOP権限を付与してください。`);

    let time = 0;

    const i = system.runInterval(() => {
        if (player.isOp()) {
            system.clearRun(i);

            world.sendMessage(`§aテストを開始します。`);

            const { block: viewBlock } = player.getBlockFromViewDirection();

            player.interact();

            system.runTimeout(() => {
                const hasPushed = player.hasTag("Capi:pushed");

                const buttonXPos = player.score.get("Capi:buttonXPos");
                const buttonYPos = player.score.get("Capi:buttonYPos");
                const buttonZPos = player.score.get("Capi:buttonZPos");

                if (hasPushed && buttonXPos === viewBlock.location.x && buttonYPos === viewBlock.location.y && buttonZPos === viewBlock.location.z) {
                    test.succeed();
                } else {
                    test.fail(`すべてのチェックが完了しませんでした: ${hasPushed}, ${buttonXPos}, ${buttonYPos}, ${buttonZPos}`);
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
    .structureName("Capi:test_buttonPush")
    .maxTicks(20 * 30);