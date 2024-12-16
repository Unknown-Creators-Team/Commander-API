import modules from "../data/modules.js";

const start = Date.now();

for(const moduleName of (modules.events as string[])) {
    const start = Date.now();

    import(`./${moduleName}`).then(() => {
        console.warn(`loaded ${moduleName} in ${Date.now() - start}ms`);
    }).catch((e) => {
        console.error(e + e.stack);
    });
}

console.warn(`loaded all events in ${Date.now() - start}ms`);
