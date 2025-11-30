import { GameMode, PlayerBreakBlockAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("break_block", "break_block")
    .initialize((player) => {
        const view = player.getBlockFromViewDirection();
        if (!view) throw new Error("Block not found in view direction.");
        console.warn(view.block.typeId);
    })
    .run(async (player) => {
        const view = player.getBlockFromViewDirection();
        if (!view) throw new Error("Block not found in view direction.");

        const { block: viewBlock } = view;
        const blockId = viewBlock.typeId;
        player.breakBlock({ x: 2, y: 4, z: 4 });

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ player: evPlayer }: PlayerBreakBlockAfterEvent) {
                if (player !== evPlayer) return;
                await system.waitTicks(1);
                const hasBreakTag = player.hasTag("capi:" + config.events.playerBreakBlock.name);
                const hasBlockId = player.hasTag(`${config.events.playerBreakBlock.name}:${blockId}`);
                const isScoreEqualX = ScoreboardUtils.getScore(player, `capi:${config.events.playerBreakBlock.name}_x`) == viewBlock.x;
                const isScoreEqualY = ScoreboardUtils.getScore(player, `capi:${config.events.playerBreakBlock.name}_y`) == viewBlock.y;
                const isScoreEqualZ = ScoreboardUtils.getScore(player, `capi:${config.events.playerBreakBlock.name}_z`) == viewBlock.z;
        
                if (!hasBreakTag || !hasBlockId || !isScoreEqualX || !isScoreEqualY || !isScoreEqualZ) {
                    throw new Error(`Test Failed: \n\tHas Break Tag: ${hasBreakTag}\n\tHas Block ID: ${hasBlockId}\n\tScore X: ${isScoreEqualX}\n\tScore Y: ${isScoreEqualY}\n\tScore Z: ${isScoreEqualZ}`);
                }
    
                system.clearRun(timeout);
                resolve(undefined);
            }
            world.afterEvents.playerBreakBlock.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.playerBreakBlock.unsubscribe(event);
                reject(new Error("Timeout waiting for playerBreakBlock event"));
            }, 100);
        });

            
    })
    .register();