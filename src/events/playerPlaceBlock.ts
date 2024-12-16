import { world } from "@minecraft/server";
import { removeTagsStartsWith, setScore } from "util.js";

world.afterEvents.playerPlaceBlock.subscribe(blockPlace => {
    const { player, block } = blockPlace;

    setScore(player, "capi:place_x", block.location.x);
    setScore(player, "capi:place_y", block.location.y);
    setScore(player, "capi:place_z", block.location.z);

    removeTagsStartsWith(player, "place:");

    player.addTagWillRemove("capi:place");
    player.addTagWillRemove(`place:${block.typeId}`);
});