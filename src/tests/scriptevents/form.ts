import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import { InferInput } from "lib/valibot.js";
import { MessageFormSchema } from "../../schema.js";
import form from "../../scriptevents/form.js";

new Test("scriptevent_form", "empty")
    .initialize((player) => {})
    .run(async (player) => {
        const formData: InferInput<typeof MessageFormSchema> = {
            typ: "msg",
            ttl: "Test Form",
            bdy: "This is a test form",
            bt1: {
                txt: "Upper"
            },
            bt2: {
                txt: "Lower"
            }
        }

        form(player, JSON.stringify(formData));
        await system.waitTicks(5);
    })
    .register();
