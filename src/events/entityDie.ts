import { Player, world } from "@minecraft/server";

world.afterEvents.entityDie.subscribe(entityDie => {
    const { damageSource, deadEntity: entity } = entityDie;
    const { damagingEntity: player, cause } = damageSource;

    if (player instanceof Player) {
        if (entity && entity.isPlayer()) {
            player.score.add("Capi:killPlayer", 1);
            player.addTagWillRemove("Capi:killPlayer");
            entity.score.add("Capi:deathPlayer", 1);
            entity.addTagWillRemove("Capi:deathPlayer");
        } else {
            player.score.add("Capi:kill", 1);
            player.addTagWillRemove("Capi:kill");
        }
    }

    if (entity instanceof Player && !(player instanceof Player)) {
        entity.score.add("Capi:death", 1);
        entity.addTagWillRemove("Capi:death");
    }
});