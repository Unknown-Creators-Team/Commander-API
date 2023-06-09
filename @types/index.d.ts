import * as MC from "@minecraft/server";
import * as MCUI from "@minecraft/server-ui";

declare module "@minecraft/server" {
    interface ComponentMap {
        "inventory": MC.EntityInventoryComponent
    }

    interface Entity { // getComponentNew("inventory") -> Inventory index.jsの41行目
        getTypedComponent<T extends keyof ComponentMap>(componentId: T): ComponentMap[T]
    }

    interface Player {
        setScore(objectName: string, score: number, type?: "set" | "reset" | "remove" | "add"): void;

        score: ScoreboardManager;
        
        rename?: string | false;
        resetName?: boolean;
        setItem?: any | false;
        run?: any | false;
        tell?: string | false;
        kick?: string | false;
        knockback?: string | false;

        setItemJson?: any | false;
        formJson?: any | false;
    }

    export interface ScoreboardManager {
        set: (objectName: string, score: number) => void;
        reset: (objectName: string) => void;
        add: (objectName: string, score: number) => void;
        remove: (objectName: string, score: number) => void;
        get: (objectName: string) => number;
    }
}

declare module "@minecraft/server-ui" {
    interface ActionFormData {
        show(player: MC.Player): Promise<MCUI.ActionFormResponse>;
    }

    interface ModalFormData {
        show(player: MC.Player): Promise<MCUI.ModalFormResponse>;
    }

    interface MessageFormData {
        show(player: MC.Player): Promise<MCUI.MessageFormResponse>;
    }
}