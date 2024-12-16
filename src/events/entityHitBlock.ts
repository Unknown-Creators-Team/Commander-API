import { world } from "@minecraft/server";
import { addScore, removeTagsStartsWith, setScore } from "util.js";

world.afterEvents.entityHitBlock.subscribe(entityHitBlock => {
    const { damagingEntity: player, hitBlock: block } = entityHitBlock;

    if (player.isPlayer()) {
        addScore(player, "capi:attacks", 1);
        setScore(player, "capi:attack_x", block.x);
        setScore(player, "capi:attack_y", block.y);
        setScore(player, "capi:attack_z", block.z);
        removeTagsStartsWith(player, "attack:");
        player.addTagWillRemove("capi:attack");
        player.addTagWillRemove(`attack:${block.typeId}`);
    }
});