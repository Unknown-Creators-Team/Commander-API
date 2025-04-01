import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { propertyArray, removeTagsStartsWith } from "util.js";

world.afterEvents.projectileHitBlock.subscribe((projectileHit) => {
    const { projectile, source: player } = projectileHit;

    if (player?.isPlayer()) {
        const { block } = projectileHit.getBlockHit();

        const data = {
            with: projectile.typeId,
            to: block.typeId,
            from: player.name,
        };

        ScoreboardUtils.setScore(player, `capi:${config.events.projectileHitBlock.name}_x`, block.x);
        ScoreboardUtils.setScore(player, `capi:${config.events.projectileHitBlock.name}_y`, block.y);
        ScoreboardUtils.setScore(player, `capi:${config.events.projectileHitBlock.name}_z`, block.z);

        removeTagsStartsWith(player, `${config.events.projectileHitBlock.name}.`);

        player.addTagWillRemove(`capi:${config.events.projectileHitBlock.name}`);

        for (const value of propertyArray(data)) {
            player.addTagWillRemove(`${config.events.projectileHitBlock.name}.${value}`);
        }
    }
});
