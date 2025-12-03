import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import tellEvent from "../../scriptevents/tell.js";

new Test("scriptevent_tell", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const testMessage = "This is a tell message test";

        // tell コマンドは実行できることを確認するだけ
        tellEvent(player, testMessage);
        await system.waitTicks(5);

        // エラーが発生しなければ成功
    })
    .register();
