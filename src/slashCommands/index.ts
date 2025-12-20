import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world } from "@minecraft/server";
import execCommand from "./exec.js";
import seCommand from "./se.js";

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    customCommandRegistry.registerCommand(...execCommand);
    customCommandRegistry.registerCommand(...seCommand);
});