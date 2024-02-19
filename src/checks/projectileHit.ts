import { Entity, GameMode, ItemStack, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { Sequence } from "./Sequence/Sequence";
import { checkUtils } from "./checkUtils";

const SPLASH_POTION_ITEMSTACK = new ItemStack("minecraft:splash_potion");

GameTest.registerAsync("commander_api", "projectileHit", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 1 }, "Test-projectileHit", GameMode.survival);
    const p2 = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 3 }, "Test-projectileHit2", GameMode.survival);
    const sequence = new Sequence(test);

    sequence
        .addWaitPromise("OP待機", checkUtils.waitOp(player, test))
        .addSequence("アイテムをセット", () => player.setItem(SPLASH_POTION_ITEMSTACK, 0, true))
        .addSequence("アイテム利用", () => player.useItem(SPLASH_POTION_ITEMSTACK))
        .addWait("10tickの待機", 20)
        .addSequence("タグのチェック", () => {
            const hitTag = player.hasTag("Capi:hit");
            const hitWithTag = player.hasTag(`hitWith:${SPLASH_POTION_ITEMSTACK.typeId}`);
            const hitToTag = player.hasTag(`hitTo:minecraft:player`);
            const hitX = player.score.get("Capi:hitX");
            const hitY = player.score.get("Capi:hitY");
            const hitZ = player.score.get("Capi:hitZ");

            if (hitTag && hitWithTag && hitToTag && hitX === Math.floor(p2.location.x) && hitY === Math.floor(p2.location.y) && hitZ === Math.floor(p2.location.z)) {
                return true;
            }

            return true;
        }, 0, true)
        .run();
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);