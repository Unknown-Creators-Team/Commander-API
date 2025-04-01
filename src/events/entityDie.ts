import { world } from "@minecraft/server";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";

world.afterEvents.entityDie.subscribe((entityDie) => {
    const { damageSource, deadEntity: entity } = entityDie;
    const { damagingEntity: player, cause } = damageSource;

    if (player?.isPlayer() && entity.isPlayer()) {
        ScoreboardUtils.addScore(player, "capi:kill_player", 1);
        ScoreboardUtils.addScore(entity, "capi:death_player", 1);
        player.addTagWillRemove("capi:kill_player");
        entity.addTagWillRemove("capi:death_player");
    }

    if (player?.isPlayer()) {
        ScoreboardUtils.addScore(player, "capi:kill", 1);
        ScoreboardUtils.setScore(player, "capi:kill_x", entity.location.x);
        ScoreboardUtils.setScore(player, "capi:kill_y", entity.location.y);
        ScoreboardUtils.setScore(player, "capi:kill_z", entity.location.z);
        player.addTagWillRemove("capi:kill");
        player.addTagWillRemove(`die_cause:${cause}`);
    }

    if (entity.isPlayer()) {
        ScoreboardUtils.addScore(entity, "capi:death", 1);
        ScoreboardUtils.setScore(entity, "capi:death_x", entity.location.x);
        ScoreboardUtils.setScore(entity, "capi:death_y", entity.location.y);
        ScoreboardUtils.setScore(entity, "capi:death_z", entity.location.z);
        entity.addTagWillRemove("capi:death");
        entity.addTagWillRemove(`die_cause:${cause}`);
    }
});
