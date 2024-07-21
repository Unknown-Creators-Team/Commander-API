import { world } from "@minecraft/server";

world.afterEvents.playerPlaceBlock.subscribe(blockPlace => {
    const { player, block } = blockPlace;

    player.removeTags(player.getTags().filter(t => t.startsWith("blockPlace:")));

    player.addTagWillRemove(`Capi:blockPlace`);
    player.addTagWillRemove(`blockPlace:${block.typeId}`);
    player.score.set("Capi:blockPlaceX", block.location.x);
    player.score.set("Capi:blockPlaceY", block.location.y);
    player.score.set("Capi:blockPlaceZ", block.location.z);
});