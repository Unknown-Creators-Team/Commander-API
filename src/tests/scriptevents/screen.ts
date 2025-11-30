import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_screen", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const screenData = {
            title: "Test Screen",
            subtitle: "This is a test",
        };

        // screen コマンドは実行できることを確認するだけ
        player.runCommand(`scriptevent capi:${config.scriptevents.screen.name} ${JSON.stringify(screenData)}`);
        await system.waitTicks(5);

        // エラーが発生しなければ成功
    })
    .register();
