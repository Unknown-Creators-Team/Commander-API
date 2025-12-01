import { PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import Test from "lib/Test.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import config from "data/config.js";

new Test("player_spawn", "empty")
    .initialize((player) => {
        player.setDynamicProperty("tags", player.getTags().join("\t"));
        console.warn(player.getTags().join("\t"));
    })
    .run(async (player) => {
        const hasSpawnTag = (player.getDynamicProperty("tags") as string).split("\t").includes(`capi:${config.events.playerSpawn.name}`);
        const scoreX = ScoreboardUtils.getScore(player, `capi:${config.events.playerSpawn.name}_x`);
        const scoreY = ScoreboardUtils.getScore(player, `capi:${config.events.playerSpawn.name}_y`);
        const scoreZ = ScoreboardUtils.getScore(player, `capi:${config.events.playerSpawn.name}_z`);
    
        if (!hasSpawnTag || scoreX === undefined || scoreY === undefined || scoreZ === undefined) {
            throw new Error(`Test Failed: \n\tHas Spawn Tag: ${hasSpawnTag}\n\tScores: (${scoreX}, ${scoreY}, ${scoreZ})`);
        }
    })
    .register();
