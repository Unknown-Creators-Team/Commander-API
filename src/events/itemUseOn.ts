import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { flattenObject, removeTagsStartsWith } from "util.js";

world.afterEvents.itemStartUseOn.subscribe(async (itemUseOn) => {
    const { source: player, itemStack: item, block } = itemUseOn;

    if (!item) return;

    const data = {
        id: item.typeId,
        name: item.nameTag,
        amount: item.amount.toString(),
        lore: item.getLore().toString(),
    };

    ScoreboardUtils.setScore(player, `capi:${config.events.itemUseOn.name}_x`, block.location.x);
    ScoreboardUtils.setScore(player, `capi:${config.events.itemUseOn.name}_y`, block.location.y);
    ScoreboardUtils.setScore(player, `capi:${config.events.itemUseOn.name}_z`, block.location.z);

    removeTagsStartsWith(player, `${config.events.itemUseOn.name}.`);

    player.addTagWillRemove(`capi:${config.events.itemUseOn.name}`);

    for (const [key, value] of Object.entries(flattenObject(data))) {
        if (value === undefined || value === null) continue;

        player.addTagWillRemove(`${config.events.itemUseOn.name}.${key}:${value?.toString()}`);
    }

    console.log(`Player ${player.name} used item ${item.typeId} on block at (${block.location.x}, ${block.location.y}, ${block.location.z})`);
});
