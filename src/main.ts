import { world } from "@minecraft/server";

world.afterEvents.worldLoad.subscribe(() => {
    console.log("Hello world!");
});
