import { world } from "@minecraft/server";
import { removeTagsStartsWith, setScore } from "util.js";

world.afterEvents.playerInteractWithEntity.subscribe(playerInteractWithEntity => {
    const { player, target: entity } = playerInteractWithEntity;

    player.score.set("Capi:interactX", Math.floor(entity.location.x));
    player.score.set("Capi:interactY", Math.floor(entity.location.y));
    player.score.set("Capi:interactZ", Math.floor(entity.location.z));
    player.addTagWillRemove(`Capi:interact`);

    player.removeTags(player.getTags().filter(t => t.startsWith("interact:")));
    player.addTagWillRemove(`interact:${entity.typeId}`);

    setScore(player, "capi.interact_x", Math.floor(entity.location.x));
    setScore(player, "capi.interact_y", Math.floor(entity.location.y));
    setScore(player, "capi.interact_z", Math.floor(entity.location.z));

    removeTagsStartsWith(player, "interact:");

    player.addTagWillRemove("capi:interact");
    player.addTagWillRemove(`interact:${entity.typeId}`);
});