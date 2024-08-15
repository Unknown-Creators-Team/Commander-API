import { Entity, GameMode, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { checkUtils } from "./checkUtils.js";

GameTest.registerAsync("commander_api", "entityHurt", async (test) => {
    const pA = test.spawnSimulatedPlayer({ "x": 1, "y": 3, "z": 1 }, "Test-entityHurt-master", GameMode.survival);
    const pB = test.spawnSimulatedPlayer({ "x": 3, "y": 3, "z": 3 }, "Test-entityHurt", GameMode.survival);

    system.runTimeout(async () => {
        const pAdamageScore = pA.score.get("Capi:damage") || 0;
        const pBhurtScore = pB.score.get("Capi:hurt") || 0;

        await checkUtils.waitOp(pA, test);

        pA.attackEntity(pB as unknown as Entity);

        system.runTimeout(() => {
            const hasDamageTag = pA.hasTag("Capi:damage");
            const hasHurtTag = pB.hasTag("Capi:hurt");
            const hasCauseTag = pB.getTags().find(v => v.startsWith("cause"));

            const pAdamageScoreNow = pA.score.get("Capi:damage");
            const pBhurtScoreNow = pB.score.get("Capi:hurt");

            if (
                hasDamageTag &&
                hasHurtTag &&
                hasCauseTag &&
                (pAdamageScoreNow === (pAdamageScore + 1)) &&
                (pBhurtScoreNow === (pBhurtScore + 1))
            ) {
                test.succeed();
            } else {
                test.fail(`1: 結果が正しくありません: hasDamageTag: ${hasDamageTag}, hasHurtTag: ${hasHurtTag}, hasCauseTag: ${hasCauseTag}, pAdamageScoreNow: ${pAdamageScoreNow}, pBhurtScoreNow: ${pBhurtScoreNow}`);
            }
        }, 5);
    }, 20);
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 60);