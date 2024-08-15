import { world } from "@minecraft/server";

world.afterEvents.projectileHitEntity.subscribe(projectileHit => {
    const { projectile, source: player } = projectileHit;
    if (!player?.isPlayer()) return;

    const hit = projectileHit.getEntityHit().entity;

    if (hit) {
        player.score.set("Capi:hitX", Math.floor(hit.location.x));
        player.score.set("Capi:hitY", Math.floor(hit.location.y));
        player.score.set("Capi:hitZ", Math.floor(hit.location.z));
    }

    player.removeTags(player.getTags().filter(t => t.startsWith("hitWith:") || t.startsWith("hitTo:")));

    player.addTagWillRemove(`Capi:hit`);
    player.addTagWillRemove(`hitWith:${projectile.typeId}`);
    player.addTagWillRemove(`hitTo:${hit?.typeId}`);
});