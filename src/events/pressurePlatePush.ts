import { world } from "@minecraft/server";

world.afterEvents.pressurePlatePush.subscribe(pressurePlatePush => {
    const { block, dimension, source: player } = pressurePlatePush;
    const { x, y, z } = block;

    if (!player.isPlayer()) return;

    player.score.set("Capi:plateX", x);
    player.score.set("Capi:plateY", y);
    player.score.set("Capi:plateZ", z);
    player.addTagWillRemove(`Capi:pushed`);
});