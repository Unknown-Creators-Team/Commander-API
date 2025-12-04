import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";

world.afterEvents.playerSpawn.subscribe(async (playerSpawn) => {
    const { player, initialSpawn } = playerSpawn;

    ScoreboardUtils.setScore(player, `capi:${config.events.playerSpawn.name}_x`, player.location.x);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerSpawn.name}_y`, player.location.y);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerSpawn.name}_z`, player.location.z);

    player.addTagWillRemove(`capi:${config.events.playerSpawn.name}`);

    if (initialSpawn) {
        player.addTagWillRemove(`capi:${config.events.playerSpawn.name}_initial`);
    }
});
