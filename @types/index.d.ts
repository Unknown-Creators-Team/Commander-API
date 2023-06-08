import * as MC from "@minecraft/server";

declare module "@minecraft/server" {
    interface Player {
        setScore(objectName: string, score: number, type: "set" | "reset" | string): void;

        rename?: string | false;
        resetName?: boolean;
        setItem?: any | false;
        formJson?: any | false;
        run?: any | false;
        tell?: string | false;
        kick?: string | false;
        knockback?: string | false;
    }
}