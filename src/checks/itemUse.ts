import { GameMode, ItemStack } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { Sequence } from "./Sequence/Sequence";
import { checkUtils } from "./checkUtils";

const DIRT_ITEMSTACK = new ItemStack("minecraft:dirt");

GameTest.registerAsync("commander_api", "itemUse", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 1 }, "Test-itemUse", GameMode.survival);
    const sequence = new Sequence(test);

    sequence
        .addWaitPromise("OP待機", checkUtils.waitOp(player, test))
        .addSequence("通常のアイテムをセット", () => player.setItem(DIRT_ITEMSTACK, 0, true))
        .addSequence("アイテム利用", () => player.useItemInSlot(0))
        .addWait("10tickの待機", 10)
        .addSequence("タグのチェック", () => {
            const hasInteractTag = player.hasTag(`itemUse:${DIRT_ITEMSTACK.typeId}`);
            const hasInteractDetailsTag = player.hasTag(`itemUseD:{id=${DIRT_ITEMSTACK.typeId},lore=[]}`);

            if (hasInteractTag && hasInteractDetailsTag) {
                return true;
            }

            return false;
        })

        .addSequence("Lore付きのアイテムをセット", () => {
            DIRT_ITEMSTACK.setLore(["TestLore"]);

            player.setItem(DIRT_ITEMSTACK, 0, true);

            return true;
        })
        .addSequence("アイテム利用", () => player.useItemInSlot(0))
        .addWait("10tickの待機", 10)
        .addSequence("タグのチェック", () => {
            const hasInteractTag = player.hasTag(`itemUse:${DIRT_ITEMSTACK.typeId}`);
            const hasInteractDetailsTag = player.hasTag(`itemUseD:{id=${DIRT_ITEMSTACK.typeId},lore=[TestLore]}`);

            if (hasInteractTag && hasInteractDetailsTag) {
                return true;
            }

            return { "reason": `タグが付与されていませんでした: ${player.getTags().join(", ")}` }
        }, 0)

        .addSequence("ネームタグとLore付きのアイテムをセット", () => {
            DIRT_ITEMSTACK.nameTag = "TestName";

            player.setItem(DIRT_ITEMSTACK, 0, true);

            return true;
        })
        .addSequence("アイテム利用", () => player.useItemInSlot(0))
        .addWait("10tickの待機", 10)
        .addSequence("タグのチェック", () => {
            const hasInteractTag = player.hasTag(`itemUse:${DIRT_ITEMSTACK.typeId}`);
            const hasInteractDetailsTag = player.hasTag(`itemUseD:{id=${DIRT_ITEMSTACK.typeId},name=TestName,lore=[TestLore]}`);

            if (hasInteractTag && hasInteractDetailsTag) {
                return true;
            }

            return { "reason": `タグが付与されていませんでした: ${player.getTags().join(", ")}` }
        }, 0, true)

        .run();
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);