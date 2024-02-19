import { GameMode } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

const DIAMOND_SWORD_TAG = "setItem:{item=minecraft:diamond_sword}";
const DIAMOND_SWORD_SLOT_2 = "setItem:{item=minecraft:diamond_sword,slot=2}";
const DIAMOND_SWORD_ENCHANTED = "setItem:{item=minecraft:diamond_sword,enchants=[{name=sharpness,level=5}]}";

const DIRT_AMOUNT_64 = "setItem:{item=minecraft:dirt,amount=64}";
const DIRT_AMOUNT_64_SLOT_2 = "setItem:{item=minecraft:dirt,amount=64,slot=2}";

GameTest.registerAsync("commander_api", "setitem", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-setItem", GameMode.survival);

    const { container } = player.getComponent("inventory");

    test.startSequence()
        .thenWaitAfter(10, () => {
            player.nameTag = "Starting... Sequence 1";

            player.addTag(DIAMOND_SWORD_TAG);
        })
        .thenExecuteAfter(5, () => {
            player.nameTag = "Sequence 1";

            const item = container.getItem(0);

            if (!item) {
                test.fail("シーケンス1: アイテムがセットされませんでした。");
                return;
            }

            if (item.typeId !== "minecraft:diamond_sword") {
                test.fail(`シーケンス1: アイテムが違います。現在のアイテム: ${item.typeId}, 予定されているアイテム: minecraft:diamond_sword`);
                return;
            }

            container.clearAll();
        })
        .thenExecuteAfter(10, () => {
            player.nameTag = "Starting... Sequence 2";

            player.addTag(DIAMOND_SWORD_SLOT_2);
        })
        .thenExecuteAfter(5, () => {
            player.nameTag = "Sequence 2";

            const item = container.getItem(2);

            if (!item) {
                test.fail("シーケンス2: アイテムがセットされませんでした。");
                return;
            }

            if (item.typeId !== "minecraft:diamond_sword") {
                test.fail(`シーケンス2: アイテムが違います。現在のアイテム: ${item.typeId}, 予定されているアイテム: minecraft:diamond_sword`);
                return;
            }

            container.clearAll();
        })
        .thenExecuteAfter(10, () => {
            player.nameTag = "Starting... Sequence 3";

            player.addTag(DIAMOND_SWORD_ENCHANTED);
        })
        .thenExecuteAfter(5, () => {
            player.nameTag = "Sequence 3";

            const item = container.getItem(0);

            if (!item) {
                test.fail("シーケンス3: アイテムがセットされませんでした。");
                return;
            }

            if (item.typeId !== "minecraft:diamond_sword") {
                test.fail(`シーケンス3: アイテムが違います。現在のアイテム: ${item.typeId}, 予定されているアイテム: minecraft:diamond_sword`);
                return;
            }

            const enchantable = item.getComponent("enchantable");

            if (!enchantable) {
                test.fail("シーケンス3: エンチャントが付与されていません。");
                return;
            }

            const enchant = enchantable.getEnchantment("sharpness");

            if (!enchant) {
                test.fail("シーケンス3: エンチャントが付与されていません。");
                return;
            }

            if (enchant.level !== 5) {
                test.fail(`シーケンス3: エンチャントのレベルが違います。現在のレベル: ${enchant.level}, 予定されているレベル: 5`);
                return;
            }

            container.clearAll();
        })
        .thenExecuteAfter(10, () => {
            player.nameTag = "Starting... Sequence 4";

            player.addTag(DIRT_AMOUNT_64);
        })
        .thenExecuteAfter(5, () => {
            player.nameTag = "Sequence 4";

            const item = container.getItem(0);

            if (!item) {
                test.fail("シーケンス4: アイテムがセットされませんでした。");
                return;
            }

            if (item.typeId !== "minecraft:dirt") {
                test.fail(`シーケンス4: アイテムが違います。現在のアイテム: ${item.typeId}, 予定されているアイテム: minecraft:dirt`);
                return;
            }

            if (item.amount !== 64) {
                test.fail(`シーケンス4: アイテムの数が違います。現在の数: ${item.amount}, 予定されている数: 64`);
                return;
            }

            container.clearAll();
        })
        .thenExecuteAfter(10, () => {
            player.nameTag = "Starting... Sequence 5";

            player.addTag(DIRT_AMOUNT_64_SLOT_2);
        })
        .thenExecuteAfter(5, () => {
            player.nameTag = "Sequence 5";

            const item = container.getItem(2);

            if (!item) {
                test.fail("シーケンス5: アイテムがセットされませんでした。");
                return;
            }

            if (item.typeId !== "minecraft:dirt") {
                test.fail(`シーケンス5: アイテムが違います。現在のアイテム: ${item.typeId}, 予定されているアイテム: minecraft:dirt`);
                return;
            }

            if (item.amount !== 64) {
                test.fail(`シーケンス5: アイテムの数が違います。現在の数: ${item.amount}, 予定されている数: 64`);
                return;
            }

            container.clearAll();
        })
        .thenSucceed();
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);