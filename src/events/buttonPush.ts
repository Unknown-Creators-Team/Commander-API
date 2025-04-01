import { world } from "@minecraft/server";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

world.afterEvents.buttonPush.subscribe(async (buttonPush) => {
    const { block, source: player } = buttonPush;
    const { x, y, z } = block;

    if (!player.isPlayer()) return;

    ScoreboardUtils.setScore(player, `capi:${config.events.buttonPush.name}_x`, x);
    ScoreboardUtils.setScore(player, `capi:${config.events.buttonPush.name}_y`, y);
    ScoreboardUtils.setScore(player, `capi:${config.events.buttonPush.name}_z`, z);
    player.addTagWillRemove(`capi:${config.events.buttonPush.name}`);
});
