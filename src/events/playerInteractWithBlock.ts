import { world } from "@minecraft/server";

world.afterEvents.playerInteractWithBlock.subscribe(playerInteractWithBlock => {
    const { player, block } = playerInteractWithBlock;
    const { x, y, z } = block;

    player.score.set("Capi:interactX", x);
    player.score.set("Capi:interactY", y);
    player.score.set("Capi:interactZ", z);
    player.addTagWillRemove(`Capi:interact`);

    player.removeTags(player.getTags().filter(t => t.startsWith("interact:")));
    player.addTagWillRemove(`interact:${block.typeId}`);
});