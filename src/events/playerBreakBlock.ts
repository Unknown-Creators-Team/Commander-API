import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "script-box-mc";
import { removeTagsStartsWith } from "utils.js";

world.afterEvents.playerBreakBlock.subscribe(async (blockBreak) => {
    const { player, block, brokenBlockPermutation } = blockBreak;

    ScoreboardUtils.setScore(player, `capi:${config.events.playerBreakBlock.name}_x`, block.x);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerBreakBlock.name}_y`, block.y);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerBreakBlock.name}_z`, block.z);

    removeTagsStartsWith(player, `${config.events.playerBreakBlock.name}:`);

    player.addTagWillRemove(`capi:${config.events.playerBreakBlock.name}`);
    player.addTagWillRemove(`${config.events.playerBreakBlock.name}:${brokenBlockPermutation.type.id}`);

    console.log(`Player ${player.name} broke block ${brokenBlockPermutation.type.id} at (${block.x}, ${block.y}, ${block.z})`);
});
