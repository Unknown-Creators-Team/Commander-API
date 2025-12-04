import { Block, Entity } from "@minecraft/server";
import { Macro } from "lib/Macro.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("Source must be a player");

    const slot = parseInt(Macro.format(source, message) ?? message);
    if (isNaN(slot)) throw new Error("Invalid slot number");
    if (slot < 0 || slot > 8) throw new Error("Slot number must be between 0 and 8");

    source.selectedSlotIndex = slot;
}
