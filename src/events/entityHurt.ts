import { Player, world } from "@minecraft/server";

world.afterEvents.entityHurt.subscribe(entityHurt => {
    const { damage, damageSource, hurtEntity: entity } = entityHurt;
    const { cause, damagingEntity: player } = damageSource;

    if (entity && entity.isPlayer()) {
        entity.score.set("Capi:hurt", damage);
        entity.addTagWillRemove(`Capi:hurt`);
        console.warn(player);
        if (player) player.removeTags(player.getTags().filter(t => t.startsWith("cause:")));
        entity.addTagWillRemove(`cause:${cause.toString()}`);
    }

    if (player instanceof Player) {
        player.score.set("Capi:damage", damage);
        player.addTagWillRemove(`Capi:damage`);
    }
});