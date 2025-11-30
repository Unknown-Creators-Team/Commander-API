import { GameMode, PlayerBreakBlockAfterEvent, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import { checkUtils } from "./checkUtils.js";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

console.warn("Registering block_break test...");

// new Test("block_break", "block_break")
//     .initialize((player) => {
//         const view = player.getBlockFromViewDirection();
//         if (!view) throw new Error("Block not found in view direction.");
//         console.warn(view.block.typeId);
//     })
//     .run(async (player) => {
//         const view = player.getBlockFromViewDirection();
//         if (!view) throw new Error("Block not found in view direction.");

//         const { block: viewBlock } = view;
//         const blockId = viewBlock.typeId;
//         player.breakBlock({ x: 2, y: 4, z: 4 });

//         // await system.waitTicks(100);

//         let timeout: number;

//         await new Promise((resolve, reject) => {
//             console.warn("Waiting for playerBreakBlock event...");
//             async function event({ player: evPlayer }: PlayerBreakBlockAfterEvent) {
//                 console.warn("PlayerBreakBlockAfterEvent triggered for player:", player.name);
//                 if (player !== evPlayer) return;
//                 await system.waitTicks(1);
//                 console.warn(viewBlock.typeId);
//                 const hasBreakTag = player.hasTag("capi:" + config.events.playerBreakBlock.name);
//                 const hasBlockId = player.hasTag(`${config.events.playerBreakBlock.name}:${blockId}`);
//                 const isScoreEqualX = ScoreboardUtils.getScore(player, "capi:break_x") == viewBlock.x;
//                 const isScoreEqualY = ScoreboardUtils.getScore(player, "capi:break_y") == viewBlock.y;
//                 const isScoreEqualZ = ScoreboardUtils.getScore(player, "capi:break_z") == viewBlock.z;
        
//                 if (!hasBreakTag || !hasBlockId || !isScoreEqualX || !isScoreEqualY || !isScoreEqualZ) {
//                     throw new Error(`Test Failed: \n\tHas Break Tag: ${hasBreakTag}\n\tHas Block ID: ${hasBlockId}\n\tScore X: ${isScoreEqualX}\n\tScore Y: ${isScoreEqualY}\n\tScore Z: ${isScoreEqualZ}`);
//                 }
    
//                 system.clearRun(timeout);
//                 resolve(undefined);
//             }
//             world.afterEvents.playerBreakBlock.subscribe(event);
//             timeout = system.runTimeout(() => {
//                 world.afterEvents.playerBreakBlock.unsubscribe(event);
//                 reject(new Error("Timeout waiting for playerBreakBlock event"));
//             }, 100);
//         });

            
//     })
//     .register();

// GameTest.register("commander_api", "blockBreak", async (test) => {
//     const player = test.spawnSimulatedPlayer({ x: 2, y: 3, z: 2 }, "Test-blockBreak", GameMode.Survival);

//     await checkUtils.waitOp(player, test);

//     world.sendMessage(`§aテストを開始します。`);

//     const view = player.getBlockFromViewDirection();

//     if (!view) {
//         test.fail("プレイヤーの視線先にブロックがありません。");
//         return;
//     }

//     const { block: viewBlock } = view;

//     player.breakBlock({ x: 2, y: 3, z: 4 });

//     system.runTimeout(() => {
//         const hasBreak = player.hasTag("Capi:blockBreak");
//         const hasBlockID = player.hasTag(`blockBreak:minecraft:dirt`);

//         const scoreX = player.score.get("Capi:blockBreakX") == viewBlock.x;
//         const scoreY = player.score.get("Capi:blockBreakY") == viewBlock.y;
//         const scoreZ = player.score.get("Capi:blockBreakZ") == viewBlock.z;

//         if (hasBreak && hasBlockID && scoreX && scoreY && scoreZ) {
//             test.succeed();
//         } else {
//             test.fail(`すべてのチェックが完了しませんでした: ${hasBreak}, ${hasBlockID}, ${scoreX}, ${scoreY}, ${scoreZ}`);
//         }
//     }, 20);
// })
//     .structureName("Capi:test_blockBreak")
//     .maxTicks(20 * 30);
