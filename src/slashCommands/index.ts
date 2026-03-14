import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandParamType, CustomCommandResult, CustomCommandStatus, system, world } from "@minecraft/server";
import execCommand from "./exec.js";
import seCommand from "./se.js";

declare global {
    type SlashCommandCallback = (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult | undefined;
    type SlashCommand = [CustomCommand, SlashCommandCallback];
}

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    customCommandRegistry.registerCommand(...execCommand);
    customCommandRegistry.registerCommand(...seCommand);
});