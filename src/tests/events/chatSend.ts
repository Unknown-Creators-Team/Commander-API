import { system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("chat_send", "empty")
    .initialize((player) => {
        player.sendMessage("Test initialized. Please send a chat message.");
    })
    .run(async (player) => {
        const testMessage = "random message " + Math.random().toString(36).substring(2);

        let timeout: number;
        await new Promise((resolve, reject) => {
            async function event({ sender: evPlayer, message }: any) {
                if (player !== evPlayer || message !== testMessage) return;
                await system.waitTicks(1);

                const hasChatTag = player.hasTag("capi:" + config.events.chatSend.name);
                const hasMessageTag = player.hasTag(`${config.events.chatSend.name}:${testMessage}`);
                const messageLength = ScoreboardUtils.getScore(player, `capi:${config.events.chatSend.name}_len`);
                const chatCount = ScoreboardUtils.getScore(player, `capi:${config.events.chatSend.name}_cnt`);

                if (!hasChatTag || !hasMessageTag || messageLength !== testMessage.length || chatCount === undefined) {
                    return reject(new Error(
                        `Test Failed: \n\tHas Chat Tag: ${hasChatTag}\n\tHas Message Tag: ${hasMessageTag}\n\tMessage Length: ${messageLength} (expected ${testMessage.length})\n\tChat Count: ${chatCount}`
                    ));
                }

                system.clearRun(timeout);
                resolve(undefined);
            }
            world.beforeEvents.chatSend.subscribe(event);
            timeout = system.runTimeout(() => {
                world.beforeEvents.chatSend.unsubscribe(event);
                reject(new Error("Timeout waiting for chatSend event. Please send the message: " + testMessage));
            }, 200);

            player.chat(testMessage);
        });
    })
    .register();
