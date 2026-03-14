import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "script-box-mc";
import { removeTagsStartsWith } from "utils.js";

world.afterEvents.playerInteractWithBlock.subscribe((playerInteractWithBlock) => {
    const { player, block } = playerInteractWithBlock;
    const { x, y, z } = block;

    ScoreboardUtils.setScore(player, `capi:${config.events.playerInteractWithBlock.name}_x`, x);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerInteractWithBlock.name}_y`, y);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerInteractWithBlock.name}_z`, z);

    removeTagsStartsWith(player, `${config.events.playerInteractWithBlock.name}:`);

    player.addTagWillRemove(`capi:${config.events.playerInteractWithBlock.name}`);
    player.addTagWillRemove(`${config.events.playerInteractWithBlock.name}:${block.typeId}`);

    console.log(`Player ${player.name} interacted with block ${block.typeId} at (${x}, ${y}, ${z})`);
});
