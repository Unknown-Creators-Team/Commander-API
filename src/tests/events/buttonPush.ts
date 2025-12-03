import { ButtonPushAfterEvent, system, world } from "@minecraft/server";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";
import Test from "lib/Test.js";

new Test("button_push", "button_push")
    .initialize((player) => {
        const view = player.getBlockFromViewDirection();
        if (!view) throw new Error("Block not found in view direction.");
    })
    .run(async (player) => {
        const view = player.getBlockFromViewDirection();
        if (!view) throw new Error("Block not found in view direction.");
        const { block: viewBlock } = view;

        player.interact();

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ source: evPlayer }: ButtonPushAfterEvent) {
                if (player !== evPlayer) return;
                await system.waitTicks(1);
                const isScoreEqualX = ScoreboardUtils.getScore(player, `capi:${config.events.buttonPush.name}_x`) == viewBlock.x;
                const isScoreEqualY = ScoreboardUtils.getScore(player, `capi:${config.events.buttonPush.name}_y`) == viewBlock.y;
                const isScoreEqualZ = ScoreboardUtils.getScore(player, `capi:${config.events.buttonPush.name}_z`) == viewBlock.z;

                if (!isScoreEqualX || !isScoreEqualY || !isScoreEqualZ) {
                    throw new Error(
                        `Test Failed: \n\tScore X: ${isScoreEqualX}\n\tScore Y: ${isScoreEqualY}\n\tScore Z: ${isScoreEqualZ}`
                    );
                }

                world.afterEvents.buttonPush.unsubscribe(event);
                system.clearRun(timeout);
                resolve(undefined);
            }
            world.afterEvents.buttonPush.subscribe(event);
            timeout = system.runTimeout(() => {
                world.afterEvents.buttonPush.unsubscribe(event);
                reject(new Error("Timeout waiting for buttonPush event"));
            }, 100);
        });
    })
    .register();
