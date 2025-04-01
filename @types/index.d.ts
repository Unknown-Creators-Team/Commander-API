import * as MC from "@minecraft/server";
import * as MCUI from "@minecraft/server-ui";
import * as Gametest from "@minecraft/gametest";

declare module "@minecraft/server" {
    interface Entity {
        addTags(tags: string[]): void;
        removeTags(tags: string[]): void;
        addTagWillRemove(tag: string): void;
    }

    interface Player {
        typeId: "minecraft:player";

        /** @deprecated moved to <Player>.score */
        setScore(objectName: string, score: number, type?: "set" | "reset" | "remove" | "add"): void;

        score: ScoreboardManager;

        rename?: string | false;
        resetName?: boolean;
        setItem?: any | false;
        run?: any | false;
        tell?: string | false;
        kick?: string | false;
        knockback?: string | false;
        join?: any;

        setItemJson?: any | false;
        formJson?: any | false;

        pushedTime?: number;
    }

    export interface ScoreboardManager {
        set: (objectName: string, score: number) => void;
        reset: (objectName: string) => void;
        add: (objectName: string, score: number) => void;
        remove: (objectName: string, score: number) => void;
        get: (objectName: string) => number;
    }
}

// declare module "@minecraft/server-ui" {
//     interface ActionFormData {
//         show(player: MC.Player): Promise<MCUI.ActionFormResponse>;
//     }

//     interface ModalFormData {
//         show(player: MC.Player): Promise<MCUI.ModalFormResponse>;
//     }

//     interface MessageFormData {
//         show(player: MC.Player): Promise<MCUI.MessageFormResponse>;
//     }
// }

declare module "@minecraft/gametest" {
    interface SimulatedPlayer {
        score: ScoreboardManager;
    }

    export interface ScoreboardManager {
        set: (objectName: string, score: number) => void;
        reset: (objectName: string) => void;
        add: (objectName: string, score: number) => void;
        remove: (objectName: string, score: number) => void;
        get: (objectName: string) => number;
    }
}