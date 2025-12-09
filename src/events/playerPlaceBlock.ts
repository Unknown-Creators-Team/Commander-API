import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { removeTagsStartsWith } from "util.js";

world.afterEvents.playerPlaceBlock.subscribe((blockPlace) => {
    const { player, block } = blockPlace;

    ScoreboardUtils.setScore(player, `capi:${config.events.playerPlaceBlock.name}_x`, block.location.x);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerPlaceBlock.name}_y`, block.location.y);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerPlaceBlock.name}_z`, block.location.z);

    removeTagsStartsWith(player, `${config.events.playerPlaceBlock.name}:`);

    player.addTagWillRemove(`capi:${config.events.playerPlaceBlock.name}`);
    player.addTagWillRemove(`${config.events.playerPlaceBlock.name}:${block.typeId}`);

    console.log(`Player ${player.name} placed block ${block.typeId} at (${block.location.x}, ${block.location.y}, ${block.location.z})`);
});
