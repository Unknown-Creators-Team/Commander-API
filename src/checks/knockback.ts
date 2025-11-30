import { GameMode, Vector3, system } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

GameTest.registerAsync("commander_api", "knockback", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 1, "y": 3, "z": 1 }, "Test-knockback", GameMode.Survival);

    system.runTimeout(() => {
        player.runCommand('scriptevent capi:knockback {"directionX": 1, "directionZ": 1, "horizontalStrength": 1, "verticalStrength": 1}');

        system.runTimeout(() => {
            const endLocation = test.worldLocation({ x: 3, y: 2, z: 3 });
            const distance = calcDistance(player.location, endLocation);

            if (distance <= 0.5) {
                test.succeed();
            } else {
                test.fail(`予定されている終点との距離が離れすぎています。距離: ${distance}, 予定距離: 0.5以下, 予定座標: ${JSON.stringify(endLocation)}`)
            }
        }, 40)
    }, 10);
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);

function calcDistance(vec1: Vector3, vec2: Vector3): number {
    return Math.hypot(vec1.x - vec2.x, vec1.y - vec2.y, vec1.z - vec2.z);
}