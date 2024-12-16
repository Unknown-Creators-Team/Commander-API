import { world } from "@minecraft/server";
import Config from "../config.js";
import { setScore } from "util.js";

world.afterEvents.playerSpawn.subscribe(async playerSpawn => {
    const { player, initialSpawn } = playerSpawn;

    setScore(player, "capi:spawn_x", player.location.x);
    setScore(player, "capi:spawn_y", player.location.y);
    setScore(player, "capi:spawn_z", player.location.z);
    
    player.addTagWillRemove("capi:spawn");

    if (initialSpawn) {
        player.addTagWillRemove("capi:initial_spawn");

        if (!Config.has("TagWillRemoveTickEnabled")) {
            Config.set("TagWillRemoveTickEnabled", true);
        }
    }
});