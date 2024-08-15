import { world } from "@minecraft/server";

world.afterEvents.targetBlockHit.subscribe(targetBlockHit => {
    const { block, dimension, source: player, previousRedstonePower, redstonePower } = targetBlockHit;
    const { x, y, z } = block;

    if (!player.isPlayer()) return;

    player.score.set("Capi:targetX", x);
    player.score.set("Capi:targetY", y);
    player.score.set("Capi:targetZ", z);
    player.score.set("Capi:targetPower", redstonePower);

    player.addTagWillRemove(`Capi:target`);
});