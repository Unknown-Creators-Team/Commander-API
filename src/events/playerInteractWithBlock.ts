import { world } from "@minecraft/server";
import { removeTagsStartsWith, setScore } from "util.js";

world.afterEvents.playerInteractWithBlock.subscribe(playerInteractWithBlock => {
    const { player, block } = playerInteractWithBlock;
    const { x, y, z } = block;

    setScore(player, "capi.interact_x", x);
    setScore(player, "capi.interact_y", y);
    setScore(player, "capi.interact_z", z);

    removeTagsStartsWith(player, "interact:");

    player.addTagWillRemove("capi:interact");
    player.addTagWillRemove(`interact:${block.typeId}`);
});