import { world } from "@minecraft/server";

world.afterEvents.entityHitBlock.subscribe(entityHitBlock => {
    const { damagingEntity: player, hitBlock: block } = entityHitBlock;

    if (!player.isPlayer()) return;

    player.score.add("Capi:attacks", 1);
    player.addTagWillRemove("Capi:attack");
    player.removeTags(player.getTags().filter(t => t.startsWith("attacked:")));
    player.addTagWillRemove(`attacked:${block.typeId}`);
});