import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import titleEvent from "../../scriptevents/title.js";

new Test("scriptevent_title", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const screenData = {
            title: "Test Title",
            subtitle: "This is a test",
        };

        // screen コマンドは実行できることを確認するだけ
        titleEvent(player, JSON.stringify(screenData));
        await system.waitTicks(5);

        // エラーが発生しなければ成功
    })
    .register();
