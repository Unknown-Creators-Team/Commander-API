import { world } from "@minecraft/server";

world.afterEvents.itemUseOn.subscribe(async itemUseOn => {
    const { source: player, itemStack: item, block } = itemUseOn;

    if (!player.isPlayer()) return;

    player.score.set("Capi:itemUseOnX", block.location.x);
    player.score.set("Capi:itemUseOnY", block.location.y);
    player.score.set("Capi:itemUseOnZ", block.location.z);

    player.removeTags(player.getTags().filter(t => t.startsWith("itemUseOn:")));

    player.addTagWillRemove(`Capi:itemUseOn`);
    player.addTagWillRemove(`itemUseOn:${block.typeId}`);
});