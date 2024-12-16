import { world } from "@minecraft/server";
import ESON from "../lib/ESON.js";
import { removeTagsStartsWith } from "util.js";

world.afterEvents.itemUse.subscribe(itemUse => {
    const { source: player, itemStack: item } = itemUse;

    const details = {
        id: item.typeId,
        name: item.nameTag,
        amount: item.amount,
        lore: item.getLore(),
    }

    removeTagsStartsWith(player, "item_use:", "item_use_details:", "item_use_details.");

    player.addTagWillRemove("capi:item_use");
    player.addTagWillRemove(`item_use:${item.typeId}`);
    player.addTagWillRemove(`item_use_details:${ESON.stringify(details)}`);

    for (const [key, value] of Object.entries(details)) {
        player.addTagWillRemove(`item_use_details.${key}:${value}`);
    }
});