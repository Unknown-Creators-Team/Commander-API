import { GameMode, ItemStack } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { Sequence } from "./Sequence/Sequence";
import { checkUtils } from "./checkUtils";

const DIRT_ITEMSTACK = new ItemStack("minecraft:dirt");

GameTest.registerAsync("commander_api", "itemUseOn", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 1 }, "Test-itemUseOn", GameMode.survival);
    const sequence = new Sequence(test);

    sequence
        .addWaitPromise("OP待機", checkUtils.waitOp(player, test))
        .addSequence("アイテムをセット", () => player.setItem(DIRT_ITEMSTACK, 0, true))
        .addSequence("アイテム利用", () => player.useItemOnBlock(DIRT_ITEMSTACK, { "x": 2, "y": 2, "z": 2 }))
        .addWait("10tickの待機", 10)

        .addSequence("タグのチェック", () => {
            const useLocation = test.worldBlockLocation({ "x": 2, "y": 2, "z": 2 });
            const hasItemUseOnTag = player.hasTag(`itemUseOn:${DIRT_ITEMSTACK.typeId}`);
            const itemUseOnX = player.score.get("Capi:itemUseOnX");
            const itemUseOnY = player.score.get("Capi:itemUseOnY");
            const itemUseOnZ = player.score.get("Capi:itemUseOnZ");

            if (hasItemUseOnTag && itemUseOnX === useLocation.x && itemUseOnY === useLocation.y && itemUseOnZ === useLocation.z) {
                return true;
            }

            return { "reason": `チェックが失敗しました: ${hasItemUseOnTag}, ${itemUseOnX}, ${itemUseOnY}, ${itemUseOnZ}` };
        }, 0, true)

        .run();
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);