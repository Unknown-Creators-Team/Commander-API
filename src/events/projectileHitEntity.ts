import { world } from "@minecraft/server";
import config from "data/config.js";
import { FMath } from "lib/FastMath.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { propertyArray, removeTagsStartsWith } from "utils.js";

world.afterEvents.projectileHitEntity.subscribe((projectileHit) => {
    const { projectile, source: player } = projectileHit;

    if (player?.isPlayer()) {
        const { entity } = projectileHit.getEntityHit();

        const data = {
            with: projectile.typeId,
            to: entity?.typeId,
            from: player.name,
        };

        if (entity) {
            ScoreboardUtils.setScore(player, `capi:${config.events.projectileHitEntity.name}_x`, FMath.floor(entity.location.x));
            ScoreboardUtils.setScore(player, `capi:${config.events.projectileHitEntity.name}_y`, FMath.floor(entity.location.y));
            ScoreboardUtils.setScore(player, `capi:${config.events.projectileHitEntity.name}_z`, FMath.floor(entity.location.z));

            removeTagsStartsWith(player, `${config.events.projectileHitEntity.name}.`);

            const data = {
                with: projectile.typeId,
                to: entity.typeId,
                from: player.name,
            };

            entity.addTagWillRemove(`capi:${config.events.projectileHitEntity.name}.victim`);

            for (const value of propertyArray(data)) {
                entity.addTagWillRemove(`${config.events.projectileHitEntity.name}.victim.${value}`);
            }
        }

        removeTagsStartsWith(player, `${config.events.projectileHitEntity.name}.`);

        player.addTagWillRemove(`capi:${config.events.projectileHitEntity.name}`);

        for (const value of propertyArray(data)) {
            player.addTagWillRemove(`${config.events.projectileHitEntity.name}.${value}`);
        }

        console.log(`Player ${player.name}'s projectile ${projectile.typeId} hit entity ${entity?.typeId}`);
    }
});
