import { world } from "@minecraft/server";

world.afterEvents.tripWireTrip.subscribe(tripWireTrip => {
    const { block, dimension, sources: players } = tripWireTrip;
    const { x, y, z } = block;

    players.forEach(player => {
        if (!player.isPlayer()) return;

        player.score.set("Capi:tripX", x);
        player.score.set("Capi:tripY", y);
        player.score.set("Capi:tripZ", z);
        player.addTagWillRemove(`Capi:trip`);
    });
});