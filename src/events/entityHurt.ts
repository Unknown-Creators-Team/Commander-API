import { world } from "@minecraft/server";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { removeTagsStartsWith } from "utils.js";

world.afterEvents.entityHurt.subscribe((entityHurt) => {
    const { damage, damageSource, hurtEntity: entity } = entityHurt;
    const { cause, damagingEntity: player } = damageSource;

    if (player?.isPlayer()) {
        ScoreboardUtils.setScore(player, "capi:damage", damage);
        ScoreboardUtils.setScore(player, "capi:damage_x", entity.location.x);
        ScoreboardUtils.setScore(player, "capi:damage_y", entity.location.y);
        ScoreboardUtils.setScore(player, "capi:damage_z", entity.location.z);
        removeTagsStartsWith(player, "damage_cause:");
        player.addTagWillRemove("capi:damage");
        player.addTagWillRemove(`damage_cause:${cause.toString()}`);
    }

    if (entity.isPlayer()) {
        ScoreboardUtils.setScore(entity, "capi:hurt", damage);
        ScoreboardUtils.setScore(entity, "capi:hurt_x", entity.location.x);
        ScoreboardUtils.setScore(entity, "capi:hurt_y", entity.location.y);
        ScoreboardUtils.setScore(entity, "capi:hurt_z", entity.location.z);
        removeTagsStartsWith(entity, "hurt_cause:");
        entity.addTagWillRemove("capi:hurt");
        entity.addTagWillRemove(`hurt_cause:${cause.toString()}`);
        console.log(`Entity ${entity.typeId} hurt with ${damage} damage, cause: ${cause.toString()}`);
    }
});
