import { world } from "@minecraft/server";
import Config from "../config.js";

world.afterEvents.playerLeave.subscribe(async playerLeave => {
    const player = playerLeave.playerName;
    if (Config.get("LeaveMsgEnabled")) world.sendMessage(String((Config.get("LeaveMsg")).replace("{name}", player)));
});