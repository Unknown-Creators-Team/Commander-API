import { world } from "@minecraft/server";
import { removeTagsStartsWith, setScore } from "util.js";

world.afterEvents.playerBreakBlock.subscribe(async blockBreak => {
    const { player, block, brokenBlockPermutation } = blockBreak;

    setScore(player, "capi:break_x", block.x);
    setScore(player, "capi:break_y", block.y);
    setScore(player, "capi:break_z", block.z);

    removeTagsStartsWith(player, "break:");

    player.addTagWillRemove("capi:break");
    player.addTagWillRemove(`break:${brokenBlockPermutation.type.id}`);
});