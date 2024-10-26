import { Block, Entity } from "@minecraft/server";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isEntity()) throw new Error("Cannot rename a non-entity.");
    
    source.kill();
}