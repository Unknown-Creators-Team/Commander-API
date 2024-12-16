import { world } from "@minecraft/server";
import { addScore, setScore } from "util.js";

world.afterEvents.entityDie.subscribe(entityDie => {
    const { damageSource, deadEntity: entity } = entityDie;
    const { damagingEntity: player, cause } = damageSource;

    if (player?.isPlayer() && entity.isPlayer()) {
        addScore(player, "capi:kill_player", 1);
        addScore(entity, "capi:death_player", 1);
        player.addTagWillRemove("capi:kill_player");
        entity.addTagWillRemove("capi:death_player");
    }

    if (player?.isPlayer()) {
        addScore(player, "capi:kill", 1);
        setScore(player, "capi:kill_x", entity.location.x);
        setScore(player, "capi:kill_y", entity.location.y);
        setScore(player, "capi:kill_z", entity.location.z);
        player.addTagWillRemove("capi:kill");
        player.addTagWillRemove(`die_cause:${cause}`);
    }

    if (entity.isPlayer()) {
        addScore(entity, "capi:death", 1);
        setScore(entity, "capi:death_x", entity.location.x);
        setScore(entity, "capi:death_y", entity.location.y);
        setScore(entity, "capi:death_z", entity.location.z);
        entity.addTagWillRemove("capi:death");
        entity.addTagWillRemove(`die_cause:${cause}`);
    }
});