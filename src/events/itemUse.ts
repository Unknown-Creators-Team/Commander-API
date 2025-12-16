import { world } from "@minecraft/server";
import config from "data/config.js";
import { flattenObject, removeTagsStartsWith } from "utils.js";

world.afterEvents.itemUse.subscribe((itemUse) => {
    const { source: player, itemStack: item } = itemUse;

    const data = {
        id: item.typeId,
        name: item.nameTag,
        amount: item.amount.toString(),
        lore: item.getLore(),
    };

    removeTagsStartsWith(player, `${config.events.itemUse.name}.`);

    player.addTagWillRemove(`capi:${config.events.itemUse.name}`);

    for (const [key, value] of Object.entries(flattenObject(data))) {
        if (value === undefined || value === null) continue;

        player.addTagWillRemove(`${config.events.itemUse.name}.${key}:${value?.toString()}`);
    }

    console.log(`Player ${player.name} used item ${item.typeId}`);
});
