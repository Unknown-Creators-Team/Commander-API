import { world } from "@minecraft/server";
import config from "data/config.js";
import ESON from "lib/ESON.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { propertyArray, removeTagsStartsWith } from "util.js";

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

    for (const value of propertyArray(data)) {
        player.addTagWillRemove(`${config.events.itemUseOn.name}.${value}`);
    }
});
