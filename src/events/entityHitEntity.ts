import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { removeTagsStartsWith } from "utils.js";

world.afterEvents.entityHitEntity.subscribe((entityHitEntity) => {
    const { damagingEntity: player, hitEntity: entity } = entityHitEntity;

    if (player.isPlayer()) {
        ScoreboardUtils.addScore(player, `capi:${config.events.entityHitEntity.name}`, 1);
        ScoreboardUtils.setScore(player, `capi:${config.events.entityHitEntity.name}_x`, entity.location.x);
        ScoreboardUtils.setScore(player, `capi:${config.events.entityHitEntity.name}_y`, entity.location.y);
        ScoreboardUtils.setScore(player, `capi:${config.events.entityHitEntity.name}_z`, entity.location.z);
        removeTagsStartsWith(player, `${config.events.entityHitEntity.name}:`);
        player.addTagWillRemove(`capi:${config.events.entityHitEntity.name}`);
        player.addTagWillRemove(`${config.events.entityHitEntity.name}:${entity.typeId}`);
        console.log(`Player ${player.name} hit entity ${entity.typeId} at (${entity.location.x}, ${entity.location.y}, ${entity.location.z})`);
    }
});
