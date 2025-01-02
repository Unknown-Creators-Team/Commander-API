import { Block, Entity, ExplosionOptions, Player } from "@minecraft/server";

export default function main(source: Entity | Block | undefined, message: string) {    
    const slot = Number(message);

    if (Number.isNaN(slot)) throw new Error("Invalid slot number");
    if (slot < 0 || slot > 8) throw new Error("Slot number must be between 0 and 8");
    if (!source?.isPlayer()) throw new Error("Cannot set slot for a non-player entity.");

    source.selectedSlotIndex = slot;
    // source.
}