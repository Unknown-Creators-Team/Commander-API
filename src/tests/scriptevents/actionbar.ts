import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import config from "data/config.js";

new Test("scriptevent_actionbar", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const testMessage = "Actionbar test message";

        // actionbar コマンドは実行できることを確認するだけ
        player.runCommand(`scriptevent capi:${config.scriptevents.actionbar.name} ${testMessage}`);
        await system.waitTicks(5);

        // エラーが発生しなければ成功
    })
    .register();
