import { world } from "@minecraft/server";
import ESON from "lib/ESON.js";
import { removeTagsStartsWith, setScore } from "util.js";

world.afterEvents.itemUseOn.subscribe(async itemUseOn => {
    const { source: player, itemStack: item, block } = itemUseOn;

    player.score.set("Capi:itemUseOnX", block.location.x);
    player.score.set("Capi:itemUseOnY", block.location.y);
    player.score.set("Capi:itemUseOnZ", block.location.z);

    player.removeTags(player.getTags().filter(t => t.startsWith("itemUseOn:")));

    player.addTagWillRemove(`Capi:itemUseOn`);
    player.addTagWillRemove(`itemUseOn:${block.typeId}`);

    const details = {
        id: item.typeId,
        name: item.nameTag,
        amount: item.amount,
        lore: item.getLore(),
    }

    removeTagsStartsWith(player, "item_use_on:", "item_use_on_details:", "item_use_on_details.");

    setScore(player, "capi.item_use_on_x", block.location.x);
    setScore(player, "capi.item_use_on_y", block.location.y);
    setScore(player, "capi.item_use_on_z", block.location.z);

    player.addTagWillRemove("capi:item_use_on");
    player.addTagWillRemove(`item_use_on:${block.typeId}`);
    player.addTagWillRemove(`item_use_on_details:${ESON.stringify(details)}`);

    for (const [key, value] of Object.entries(details)) {
        player.addTagWillRemove(`item_use_on_details.${key}:${value}`);
    }
});