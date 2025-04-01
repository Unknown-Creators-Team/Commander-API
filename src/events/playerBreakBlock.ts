import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { removeTagsStartsWith } from "util.js";

world.afterEvents.playerBreakBlock.subscribe(async (blockBreak) => {
    const { player, block, brokenBlockPermutation } = blockBreak;

    ScoreboardUtils.setScore(player, `capi:${config.events.playerBreakBlock.name}_x`, block.x);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerBreakBlock.name}_y`, block.y);
    ScoreboardUtils.setScore(player, `capi:${config.events.playerBreakBlock.name}_z`, block.z);

    removeTagsStartsWith(player, `${config.events.playerBreakBlock.name}:`);

    player.addTagWillRemove(`capi:${config.events.playerBreakBlock.name}`);
    player.addTagWillRemove(`${config.events.playerBreakBlock.name}:${brokenBlockPermutation.type.id}`);
});
