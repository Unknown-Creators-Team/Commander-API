import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { removeTagsStartsWith } from "utils.js";

world.afterEvents.entityHitBlock.subscribe((entityHitBlock) => {
    const { damagingEntity: player, hitBlock: block } = entityHitBlock;

    if (player.isPlayer()) {
        ScoreboardUtils.addScore(player, `capi:${config.events.entityHitBlock.name}`, 1);
        ScoreboardUtils.setScore(player, `capi:${config.events.entityHitBlock.name}_x`, block.x);
        ScoreboardUtils.setScore(player, `capi:${config.events.entityHitBlock.name}_y`, block.y);
        ScoreboardUtils.setScore(player, `capi:${config.events.entityHitBlock.name}_z`, block.z);
        removeTagsStartsWith(player, `${config.events.entityHitBlock.name}:`);
        player.addTagWillRemove(`capi:${config.events.entityHitBlock.name}`);
        player.addTagWillRemove(`${config.events.entityHitBlock.name}:${block.typeId}`);
        console.log(`Player ${player.name} hit block ${block.typeId} at (${block.x}, ${block.y}, ${block.z})`);
    }
});
