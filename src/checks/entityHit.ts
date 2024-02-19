import { GameMode, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

GameTest.registerAsync("commander_api", "entityHit", async (test) => {
    const pA = test.spawnSimulatedPlayer({ "x": 1, "y": 3, "z": 1 }, "Test-entityHit-master", GameMode.survival);
    const cow = pA.dimension.spawnEntity("minecraft:cow", pA.location);

    system.runTimeout(() => {
        const pAattackScore = pA.score.get("Capi:attacks") || 0;

        pA.lookAtEntity(cow);

        world.sendMessage(`§a${pA.name} §bにOP権限を付与してください。`);

        let time = 0;

        function pAKillpB() {
            pA.attackEntity(cow);

            system.runTimeout(() => {
                const hasAttack = pA.hasTag("attacked:minecraft:cow");
                const pAattackScoreNow = pA.score.get("Capi:attacks");

                if (hasAttack && (pAattackScoreNow === (pAattackScore + 1))) {
                    test.succeed();
                } else {
                    test.fail(`1: 結果が正しくありません: hasAttack: ${hasAttack}, pAattackScoreNow: ${pAattackScoreNow}`);
                }

                cow.remove();
            }, 5);
        }

        const i = system.runInterval(() => {
            if (pA.isOp()) {
                system.clearRun(i);

                world.sendMessage(`§aテストを開始します。`);

                pAKillpB();
            } else {
                time++;

                if (time > 10) {
                    test.fail("OP権限が付与されていません。");
                }
            }
        }, 20);
    }, 20);
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 60);