import { world } from "@minecraft/server";
import Config from "../config.js";

world.afterEvents.playerSpawn.subscribe(async playerSpawn => {
    const { player, initialSpawn } = playerSpawn;

    if (initialSpawn) {
        player.join = true;
        player.runCommandAsync("function Capi/setup");
        if (Config.has("TagWillRemoveTickEnabled")) Config.set("TagWillRemoveTickEnabled", true);
    }
});