import { world } from "@minecraft/server";
import ESON from "../lib/ESON.js";
import { propertyArray, removeTagsStartsWith } from "util.js";
import config from "data/config.js";

world.afterEvents.itemUse.subscribe((itemUse) => {
    const { source: player, itemStack: item } = itemUse;

    const data = {
        id: item.typeId,
        name: item.nameTag,
        amount: item.amount.toString(),
        lore: item.getLore().toString(),
    };

    removeTagsStartsWith(player, `${config.events.itemUse.name}.`);

    player.addTagWillRemove(`capi:${config.events.itemUse.name}`);

    for (const value of propertyArray(data)) {
        player.addTagWillRemove(`${config.events.itemUse.name}.${value}`);
    }
});
