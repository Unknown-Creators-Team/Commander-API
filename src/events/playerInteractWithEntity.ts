import { world } from "@minecraft/server";

world.afterEvents.playerInteractWithEntity.subscribe(playerInteractWithEntity => {
    const { player, target: entity } = playerInteractWithEntity;

    player.score.set("Capi:interactX", Math.floor(entity.location.x));
    player.score.set("Capi:interactY", Math.floor(entity.location.y));
    player.score.set("Capi:interactZ", Math.floor(entity.location.z));
    player.addTagWillRemove(`Capi:interact`);

    player.removeTags(player.getTags().filter(t => t.startsWith("interact:")));
    player.addTagWillRemove(`interact:${entity.typeId}`);
});