import { GameMode, ItemStack, Vector, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { checkUtils } from "./checkUtils";

GameTest.register("commander_api", "blockPlace", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-blockPlace", GameMode.survival);

    world.sendMessage(`§a${player.name} §bにOP権限を付与してください。`);

    await checkUtils.waitOp(player, test);

    const relativeLocation = { "x": 2, "y": 3, "z": 4 };
    const location = test.worldBlockLocation(relativeLocation);

    world.sendMessage(`§aテストを開始します。`);

    const item = new ItemStack("planks", 1);
    player.useItemOnBlock(item, relativeLocation);

    system.runTimeout(() => {
        const hasPlace = player.hasTag("Capi:blockPlace");
        const hasBlockID = player.hasTag(`blockPlace:minecraft:oak_planks`);

        const resultLocation = Vector.add(location, { x: 0, y: 1, z: 0 });

        const scoreX = player.score.get("Capi:blockPlaceX") == resultLocation.x;
        const scoreY = player.score.get("Capi:blockPlaceY") == resultLocation.y;
        const scoreZ = player.score.get("Capi:blockPlaceZ") == resultLocation.z;

        if (hasPlace && hasBlockID && scoreX && scoreY && scoreZ) {
            test.succeed();
        } else {
            test.fail(`すべてのチェックが完了しませんでした: ${hasPlace}, ${hasBlockID}, ${scoreX}, ${scoreY}, ${scoreZ}`);
        }
    }, 20);
})
    .structureName("Capi:test_blockBreak")
    .maxTicks(20 * 30);