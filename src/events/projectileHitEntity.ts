import { world } from "@minecraft/server";
import { removeTagsStartsWith } from "util.js";

world.afterEvents.projectileHitEntity.subscribe(projectileHit => {
    const { projectile, source: player } = projectileHit;
    
    if (player?.isPlayer()) {
        const { entity } = projectileHit.getEntityHit();

        if (entity) {
            player.score.set("capi:hit_x", Math.floor(entity.location.x));
            player.score.set("capi:hit_y", Math.floor(entity.location.y));
            player.score.set("capi:hit_z", Math.floor(entity.location.z));
        }

        removeTagsStartsWith(player, "hit_with:", "hit_to:", "hit_from:");

        player.addTagWillRemove("capi:hit");
        player.addTagWillRemove(`hit_with:${projectile.typeId}`);
        player.addTagWillRemove(`hit_to:${entity?.typeId}`);
        projectile.addTagWillRemove(`hit_from:${player.name}`);
    }
});