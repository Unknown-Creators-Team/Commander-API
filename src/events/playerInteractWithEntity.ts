import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "script-box-mc";
import { removeTagsStartsWith } from "utils.js";

world.afterEvents.playerInteractWithEntity.subscribe((playerInteractWithEntity) => {
    const { player, target: entity } = playerInteractWithEntity;

    ScoreboardUtils.setScore(player, `capi:${config.events.playerInteractWithEntity}_x`, Math.floor(entity.location.x));
    ScoreboardUtils.setScore(player, `capi:${config.events.playerInteractWithEntity}_y`, Math.floor(entity.location.y));
    ScoreboardUtils.setScore(player, `capi:${config.events.playerInteractWithEntity}_z`, Math.floor(entity.location.z));

    removeTagsStartsWith(player, `${config.events.playerInteractWithEntity}:`);

    player.addTagWillRemove(`capi:${config.events.playerInteractWithEntity}`);
    player.addTagWillRemove(`${config.events.playerInteractWithEntity}:${entity.typeId}`);

    console.log(`Player ${player.name} interacted with entity ${entity.typeId}`);
});
