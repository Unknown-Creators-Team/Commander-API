import { EntityDamageCause, EntityHurtAfterEvent, world } from "@minecraft/server";
import { ScoreboardDatabase } from "lib/DatabaseMC.js";
import Test from "lib/Test.js";
import call from "../../scriptevents/call.js";

new Test("scriptevent_call", "empty")
    .initialize((player) => { })
    .run(async (player) => {
        // playerに対してcallで設定したダメージコマンドが正しく実行されるか確認する
        const testCallName = "for_test_" + Math.random().toString(36).substring(2);
        const database = new ScoreboardDatabase<string, string[]>(`CAPI_CALLS`);
        database.set(testCallName, [`damage ${player.name} 1 piston`]);

        const callData = {
            name: testCallName,
            function: "test_function",
        };

        async function event({ hurtEntity: evPlayer, damageSource: { cause } }: EntityHurtAfterEvent) {
            if (player.id === evPlayer.id && cause === EntityDamageCause.piston) {
                world.afterEvents.entityHurt.unsubscribe(event);
            }
        }

        world.afterEvents.entityHurt.subscribe(event);

        try {
            call(player, JSON.stringify(callData));
        } catch (e) {
            throw e;
        } finally {
            world.afterEvents.entityHurt.unsubscribe(event);
            database.delete(testCallName);
        }
    })
    .register();
