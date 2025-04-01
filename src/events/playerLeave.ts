import { world } from "@minecraft/server";
import config from "data/config.js";

world.afterEvents.playerLeave.subscribe(async (playerLeave) => {
    const name = playerLeave.playerName;

    if (config.others.leave.enabled) {
        const msg = config.others.leave.message.replace("{name}", name);
        world.sendMessage(msg);
    }
});
