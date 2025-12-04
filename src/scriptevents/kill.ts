import { Block, Entity, GameMode } from "@minecraft/server";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot kill a non-player entity.");

    const gamemode = source.getGameMode();
    source.setGameMode(GameMode.Adventure);
    source.kill();
    source.setGameMode(gamemode);
}
