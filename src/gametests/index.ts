import { world } from "@minecraft/server";
import config from "../data/config.js";

if (config.basic.tests.enabled) {
    const start = Date.now();

    if (config.basic.tests.events) {
        for (const [event, data] of Object.entries(config.events)) {
            if (data.enabled && !data.inline) {
                await import(`./events/${event}`).catch((e) => {
                    console.error(`${e}\n${e instanceof Error && e.stack}`);
                });
            }
        }
    }

    if (config.basic.tests.scriptevents) {
        for (const [event, data] of Object.entries(config.scriptevents)) {
            if (data.enabled) {
                await import(`./scriptevents/${event}`).catch((e) => {
                    console.error(`${e}\n${e instanceof Error && e.stack}`);
                });
            }
        }
    }

    console.info(`loaded all tests in ${Date.now() - start}ms`);
}
