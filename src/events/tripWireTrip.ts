import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "script-box-mc";

world.afterEvents.tripWireTrip.subscribe((tripWireTrip) => {
    const { block, sources: players } = tripWireTrip;

    // なぜかfor ofだと "TypeError: value is not iterable    at <anonymous>" エラーが発生する
    players.forEach((player) => {
        if (player.isPlayer()) {
            ScoreboardUtils.setScore(player, `capi:${config.events.tripWireTrip.name}_x`, block.x);
            ScoreboardUtils.setScore(player, `capi:${config.events.tripWireTrip.name}_y`, block.y);
            ScoreboardUtils.setScore(player, `capi:${config.events.tripWireTrip.name}_z`, block.z);
            player.addTagWillRemove(`capi:${config.events.tripWireTrip.name}`);

            console.log(`Player ${player.name} tripped trip wire at (${block.x}, ${block.y}, ${block.z})`);
        }
    });
});
