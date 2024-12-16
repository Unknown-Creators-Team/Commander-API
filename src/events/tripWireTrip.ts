import { world } from "@minecraft/server";
import { setScore } from "util.js";

world.afterEvents.tripWireTrip.subscribe((tripWireTrip) => {
    const { block, sources: players } = tripWireTrip;

    for (const player of players)
        if (player.isPlayer()) {
            setScore(player, "capi:trip_x", block.x);
            setScore(player, "capi:trip_y", block.y);
            setScore(player, "capi:trip_z", block.z);
            player.addTagWillRemove("capi:trip");
        }
});
