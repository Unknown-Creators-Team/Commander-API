import { GameMode, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { checkUtils } from "./checkUtils";

GameTest.registerAsync("commander_api", "entityHit", async (test) => {
    const pA = test.spawnSimulatedPlayer({ "x": 1, "y": 3, "z": 1 }, "Test-entityHit-master", GameMode.survival);
    const cow = pA.dimension.spawnEntity("minecraft:cow", pA.location);

    system.runTimeout(async () => {
        const pAattackScore = pA.score.get("Capi:attacks") || 0;

        pA.lookAtEntity(cow);

        world.sendMessage(`§a${pA.name} §bにOP権限を付与してください。`);

        await checkUtils.waitOp(pA, test);

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

    }, 20);
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 60);