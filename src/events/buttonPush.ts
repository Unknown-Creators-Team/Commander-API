import { world } from "@minecraft/server";

world.afterEvents.buttonPush.subscribe(async buttonPush => {
    const { block, source: player } = buttonPush;
    const { x, y, z } = block;

    if (!player.isPlayer()) return;

    player.score.set("capi:button_x", x);
    player.score.set("capi:button_y", y);
    player.score.set("capi:button_z", z);
    player.addTagWillRemove(`capi:button_push`);
});