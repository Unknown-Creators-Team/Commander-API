import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";

world.afterEvents.pressurePlatePush.subscribe((pressurePlatePush) => {
    const { block, source: player } = pressurePlatePush;

    if (player.isPlayer()) {
        ScoreboardUtils.setScore(player, `capi:${config.events.pressurePlatePush.name}_x`, block.location.x);
        ScoreboardUtils.setScore(player, `capi:${config.events.pressurePlatePush.name}_y`, block.location.y);
        ScoreboardUtils.setScore(player, `capi:${config.events.pressurePlatePush.name}_z`, block.location.z);

        player.addTagWillRemove(`capi:${config.events.pressurePlatePush.name}`);

        console.log(`Player ${player.name} pushed pressure plate at (${block.location.x}, ${block.location.y}, ${block.location.z})`);
    }
});
