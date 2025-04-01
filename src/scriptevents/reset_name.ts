import { Block, Entity } from "@minecraft/server";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Cannot rename a non-player entity.");

    source.nameTag = source.name;
}
