import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import form from "../../scriptevents/form.js";

new Test("scriptevent_form", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const formData = {
            type: "message",
            title: "Test Form",
            body: "This is a test form",
            btn1: {
                txt: "Upper"
            },
            btn2: {
                txt: "Lower"
            }
        };

        form(player, JSON.stringify(formData));
        await system.waitTicks(5);
    })
    .register();
