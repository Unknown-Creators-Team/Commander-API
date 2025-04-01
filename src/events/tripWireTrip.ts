import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";

world.afterEvents.tripWireTrip.subscribe((tripWireTrip) => {
    const { block, sources: players } = tripWireTrip;

    for (const player of players) {
        if (player.isPlayer()) {
            ScoreboardUtils.setScore(player, `capi:${config.events.tripWireTrip.name}_x`, block.x);
            ScoreboardUtils.setScore(player, `capi:${config.events.tripWireTrip.name}_y`, block.y);
            ScoreboardUtils.setScore(player, `capi:${config.events.tripWireTrip.name}_z`, block.z);
            player.addTagWillRemove(`capi:${config.events.tripWireTrip.name}`);
        }
    }
});
