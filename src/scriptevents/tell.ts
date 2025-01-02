import { Block, Entity, ExplosionOptions, Player } from "@minecraft/server";
import { format } from "../util.js";

export default function main(source: Entity | Block | undefined, message: string) {    
    if(!source?.isPlayer()) throw new Error('This event can only be called by a player');

    const text = format(source, message);

    if (!text) return;

    source.sendMessage(text);
}