import { world } from "@minecraft/server";
import { removeTagsStartsWith, setScore } from "util.js";

world.afterEvents.projectileHitBlock.subscribe(projectileHit => {
    const { projectile, source: player } = projectileHit;

    if (player?.isPlayer()) {
        const { block } = projectileHit.getBlockHit();

        setScore(player, "capi:hit_x", block.x);
        setScore(player, "capi:hit_y", block.y);
        setScore(player, "capi:hit_z", block.z);

        removeTagsStartsWith(player, "hit_with:", "hit_to:", "hit_from:");

        player.addTagWillRemove("capi:hit");
        player.addTagWillRemove(`hit_with:${projectile.typeId}`);
        player.addTagWillRemove(`hit_to:${block.typeId}`);
        projectile.addTagWillRemove(`hit_from:${player.name}`);
    }
});