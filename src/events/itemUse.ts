import { world } from "@minecraft/server";
import ESON from "../lib/ESON";

world.afterEvents.itemUse.subscribe(itemUse => {
    const { source: player, itemStack: item } = itemUse;

    const details = {
        id: item.typeId,
        name: item.nameTag,
        lore: item.getLore()
    }

    player.removeTags(player.getTags().filter(t => t.startsWith("itemUse:") || t.startsWith("itemUseD:")));

    player.addTagWillRemove(`Capi:itemUse`);
    player.addTagWillRemove(`itemUse:${item.typeId}`);
    player.addTagWillRemove(`itemUseD:${ESON.stringify(details)}`);
});