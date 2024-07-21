import { world } from "@minecraft/server";

world.afterEvents.playerBreakBlock.subscribe(async blockBreak => {
    const { player, block, brokenBlockPermutation } = blockBreak;

    player.removeTags(player.getTags().filter(t => t.startsWith("blockBreak:")));

    player.addTagWillRemove(`Capi:blockBreak`);
    player.addTagWillRemove(`blockBreak:${brokenBlockPermutation.type.id}`);
    player.score.set("Capi:blockBreakX", block.x);
    player.score.set("Capi:blockBreakY", block.y);
    player.score.set("Capi:blockBreakZ", block.z);
});