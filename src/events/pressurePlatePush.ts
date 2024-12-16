import { world } from "@minecraft/server";
import { setScore } from "util.js";

world.afterEvents.pressurePlatePush.subscribe(pressurePlatePush => {
    const { block, source: player } = pressurePlatePush;
    
    if (player.isPlayer()) {
        setScore(player, "capi:plate_x", block.location.x);
        setScore(player, "capi:plate_y", block.location.y);
        setScore(player, "capi:plate_z", block.location.z);

        player.addTagWillRemove("capi:plate_push");
    }
});