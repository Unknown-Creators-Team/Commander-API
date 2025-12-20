import * as MC from "@minecraft/server";
import * as MCUI from "@minecraft/server-ui";
import * as Gametest from "@minecraft/gametest";

declare module "@minecraft/server" {
    interface Entity {
        addTags(tags: string[]): void;
        removeTags(tags: string[]): void;
        addTagWillRemove(tag: string): void;
    }
    
    interface System {
        readonly isCapiExtensionLoaded: boolean;
        readonly isCapiScreenLoaded: boolean;
    }
}

declare global {
    type SlashCommandCallback = (origin: MC.CustomCommandOrigin, ...args: any[]) => MC.CustomCommandResult | undefined;
    type SlashCommand = [MC.CustomCommand, SlashCommandCallback];
}