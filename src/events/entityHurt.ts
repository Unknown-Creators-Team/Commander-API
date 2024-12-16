import { world } from "@minecraft/server";
import { removeTagsStartsWith, setScore } from "util.js";

world.afterEvents.entityHurt.subscribe(entityHurt => {
    const { damage, damageSource, hurtEntity: entity } = entityHurt;
    const { cause, damagingEntity: player } = damageSource;

    if (player?.isPlayer()) {
        setScore(player, "capi:damage", damage);
        setScore(player, "capi:damage_x", entity.location.x);
        setScore(player, "capi:damage_y", entity.location.y);
        setScore(player, "capi:damage_z", entity.location.z);
        removeTagsStartsWith(player, "damage_cause:");
        player.addTagWillRemove("capi:damage");
        player.addTagWillRemove(`damage_cause:${cause.toString()}`);
    }

    if (entity.isPlayer()) {
        setScore(entity, "capi:hurt", damage);
        setScore(entity, "capi:hurt_x", entity.location.x);
        setScore(entity, "capi:hurt_y", entity.location.y);
        setScore(entity, "capi:hurt_z", entity.location.z);
        removeTagsStartsWith(entity, "hurt_cause:");
        entity.addTagWillRemove("capi:hurt");
        entity.addTagWillRemove(`hurt_cause:${cause.toString()}`);
    }
});