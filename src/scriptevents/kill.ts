import { Block, Entity, GameMode } from "@minecraft/server";
import { format } from "../util.js";


export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot kill a non-player entity.");
    
    const gamemode = source.getGameMode();
    source.setGameMode(GameMode.adventure);
    source.kill();
    source.setGameMode(gamemode);
}