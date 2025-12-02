import { ScoreboardDatabase } from "lib/DatabaseMC.js";
import Test from "lib/Test.js";
import call from "../../scriptevents/call.js";

new Test("scriptevent_call", "empty")
    .initialize((player) => { })
    .run(async (player) => {
        const testCallName = "for_test_" + Math.random().toString(36).substring(2);
        const database = new ScoreboardDatabase<string, string[]>(`CAPI_CALLS`);

        // save test data
        database.set(testCallName, ["say Hi"]);

        const callData = {
            name: testCallName,
            function: "test_function",
        };

        try {
            call(player, JSON.stringify(callData));
        } catch (e) {
            throw e;
        } finally {
            database.delete(testCallName);
        }
    })
    .register();
