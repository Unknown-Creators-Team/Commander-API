import { world } from "@minecraft/server";

world.afterEvents.buttonPush.subscribe(async buttonPush => {
    const { block, source: player } = buttonPush;
    const { x, y, z } = block;

    if (!player.isPlayer()) return;

    player.score.set("Capi:buttonXPos", x);
    player.score.set("Capi:buttonYPos", y);
    player.score.set("Capi:buttonZPos", z);
    player.addTagWillRemove(`Capi:pushed`);
});