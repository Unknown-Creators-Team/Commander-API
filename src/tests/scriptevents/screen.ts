import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import screenEvent from "../../scriptevents/screen.js";

new Test("scriptevent_screen", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const screenData = {
            title: "Test Screen",
            subtitle: "This is a test",
        };

        // screen コマンドは実行できることを確認するだけ
        screenEvent(player, JSON.stringify(screenData));
        await system.waitTicks(5);

        // エラーが発生しなければ成功
    })
    .register();
