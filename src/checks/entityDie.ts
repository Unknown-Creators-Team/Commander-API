import { GameMode, Vector3, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { getScore } from "../util";

GameTest.registerAsync("commander_api", "entityDie", async (test) => {
    const pA = test.spawnSimulatedPlayer({ "x": 1, "y": 3, "z": 1 }, "Test-entityDie-master", GameMode.survival);
    const pB = test.spawnSimulatedPlayer({ "x": 3, "y": 3, "z": 3 }, "Test-entityDie", GameMode.survival);

    system.runTimeout(() => {
        const pAKillPlayerScore = pA.score.get("Capi:killPlayer") || 0;
        const pBDeathPlayerScore = pB.score.get("Capi:deathPlayer") || 0;

        const pAKillScore = getScore(pA, "Capi:kill") || 0;
        const pADeathScore = getScore(pA, "Capi:death") || 0;

        pA.lookAtEntity(pB);
        pB.lookAtEntity(pA);

        world.sendMessage(`§a${pA.name} §bにOP権限を付与してください。`);

        let time = 0;

        function pAKillpB() {
            const health = pB.getComponent("health");

            health.setCurrentValue(1);

            pA.attackEntity(pB);

            system.runTimeout(() => {
                const hasKill = pA.hasTag("Capi:killPlayer");
                const hasDeathPlayer = pB.hasTag("Capi:deathPlayer");

                const pAKillPlayerScoreNow = pA.score.get("Capi:killPlayer");
                const pBDeathPlayerScoreNow = pB.score.get("Capi:deathPlayer");

                if (hasKill && hasDeathPlayer && (pAKillPlayerScoreNow === (pAKillPlayerScore + 1)) && (pBDeathPlayerScoreNow === (pBDeathPlayerScore + 1))) {
                    pAKillEntity();
                } else {
                    test.fail(`1: 結果が正しくありません: hasKill: ${hasKill}, hasDeathPlayer: ${hasDeathPlayer}, pAKillPlayerScoreNow: ${pAKillPlayerScoreNow}, pBDeathPlayerScoreNow: ${pBDeathPlayerScoreNow}`);
                }
            }, 20);
        }

        function pAKillEntity() {
            const spawnLocation: Vector3 = {
                x: pA.location.x + pA.getViewDirection().x * 2,
                y: pA.location.y,
                z: pA.location.z + pA.getViewDirection().z * 2,
            }

            const entity = pA.dimension.spawnEntity("minecraft:cow", spawnLocation);
            const health = entity.getComponent("health");

            health.setCurrentValue(1);

            pA.attackEntity(entity);

            system.runTimeout(() => {
                const hasKill = pA.hasTag("Capi:kill");
                const pAKillScoreNow = pA.score.get("Capi:kill");

                if (hasKill && (pAKillScoreNow === (pAKillScore + 1))) {
                    pADieByEntity();
                } else {
                    test.fail(`2: 結果が正しくありません: hasKill: ${hasKill}, pAKillScoreNow: ${pAKillScoreNow}`);
                }
            }, 20);
        }

        function pADieByEntity() {
            const spawnLocation: Vector3 = {
                x: pA.location.x + pA.getViewDirection().x * 2,
                y: pA.location.y,
                z: pA.location.z + pA.getViewDirection().z * 2,
            }
            const entity = pA.dimension.spawnEntity("minecraft:husk", spawnLocation);

            const i = system.runInterval(() => {
                const health = pA.getComponent("health");

                if (health.currentValue <= 0) {
                    system.runTimeout(() => {
                        const hasDeath = pA.hasTag("Capi:death");
                        const pADeathScoreNow = pA.score.get("Capi:death");

                        if (hasDeath && (pADeathScoreNow === (pADeathScore + 1))) {
                            entity.remove();
                            test.succeed();
                        } else {
                            test.fail(`3: 結果が正しくありません: hasDeath: ${hasDeath}, pADeathScoreNow: ${pADeathScoreNow}`);
                        }
                    }, 20);

                    system.clearRun(i);
                }
            }, 20);
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