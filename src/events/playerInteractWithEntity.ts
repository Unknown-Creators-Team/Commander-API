import { world } from "@minecraft/server";
import config from "data/config.js";
import { FMath } from "lib/FastMath.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { removeTagsStartsWith } from "utils.js";

world.afterEvents.playerInteractWithEntity.subscribe((playerInteractWithEntity) => {
    const { player, target: entity } = playerInteractWithEntity;

    ScoreboardUtils.setScore(player, `capi:${config.events.playerInteractWithEntity}_x`, FMath.floor(entity.location.x));
    ScoreboardUtils.setScore(player, `capi:${config.events.playerInteractWithEntity}_y`, FMath.floor(entity.location.y));
    ScoreboardUtils.setScore(player, `capi:${config.events.playerInteractWithEntity}_z`, FMath.floor(entity.location.z));

    removeTagsStartsWith(player, `${config.events.playerInteractWithEntity}:`);

    player.addTagWillRemove(`capi:${config.events.playerInteractWithEntity}`);
    player.addTagWillRemove(`${config.events.playerInteractWithEntity}:${entity.typeId}`);

    console.log(`Player ${player.name} interacted with entity ${entity.typeId}`);
});
