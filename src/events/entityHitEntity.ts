import { world } from "@minecraft/server";
import { addScore, removeTagsStartsWith, setScore } from "util.js";

world.afterEvents.entityHitEntity.subscribe(entityHitEntity => {
    const { damagingEntity: player, hitEntity: entity } = entityHitEntity;

    if (player.isPlayer()) {
        addScore(player, "capi:attacks", 1);
        setScore(player, "capi:attack_x", entity.location.x);
        setScore(player, "capi:attack_y", entity.location.y);
        setScore(player, "capi:attack_z", entity.location.z);
        removeTagsStartsWith(player, "attack:");
        player.addTagWillRemove("capi:attack");
        player.addTagWillRemove(`attack:${entity.typeId}`);
    }
});