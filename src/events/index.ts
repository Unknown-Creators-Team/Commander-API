import config from "../data/config.js";

const start = Date.now();

for (const [event, data] of Object.entries(config.events)) {
    const start = Date.now();

    if (data.enabled && !data.inline) {
        await import(`./${event}`).catch((e) => {
            console.error(e + e.stack);
        });
        console.log(`loaded ${event} in ${Date.now() - start}ms`);
    }
}

console.info(`loaded all events in ${Date.now() - start}ms`);
