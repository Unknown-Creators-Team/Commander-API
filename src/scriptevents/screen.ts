import { Block, Entity, Player, system, world } from "@minecraft/server";
import { Macro } from "lib/Macro.js";
import { parseFormat } from "utils.js";
import * as v from "valibot";
import { ScreenSchema } from "schema.js";
import config from "data/config.js";

const SCREEN_SYMBOL = "§Ø";
const data = new Map<Player["id"], Map<string, string>>();
const queue = new Map<Player["id"], Map<string, string>>();

export default function main(source: Entity | Block | undefined, message: string) {
    if (!config.others.extensions["Commander-API-Screen"].forceUse && !system.isCapiScreenLoaded)
        throw new Error("Commander API Screen is not loaded.");
    if (!source?.isPlayer()) throw new Error("screen scriptevent can only be used on players.");

    const parsed = parseFormat(message, source);
    const object = v.parse(ScreenSchema, parsed);

    const type = object.type.padStart(2, " ");

    if (object.type === "ca") {
        const codes = getAllCodes(source);
        for (const code of codes) enqueue(code, "", source);
        return;
    }

    if ("index" in object) {
        const code = type + object.index;
        enqueue(code, object.text ?? "", source);
    } else {
        const code = type + "1";
        enqueue(code, object.text ?? "", source);
    }
}

system.runInterval(() => {
    const players = getPlayersWithQueue();
    for (const player of players) {
        const item = popFromQueue(player);
        if (!item) continue;
        const content = SCREEN_SYMBOL + item.code + item.text;
        player.onScreenDisplay.setTitle(content);
    }
});

function enqueue(code: string, text: string, player: Player): void {
    const previousText = getTextContent(code, player);
    if (text === previousText) return;

    setTextContent(code, text, player);
    addToQueue(code, text, player);
}

function getTextContent(code: string, player: Player): string {
    let playerData = data.get(player.id);
    if (!playerData) {
        playerData = new Map<string, string>();
        data.set(player.id, playerData);
    }
    const previousText = playerData.get(code) || "";
    return previousText;
}

function setTextContent(code: string, text: string, player: Player): void {
    let playerData = data.get(player.id);
    if (!playerData) {
        playerData = new Map<string, string>();
        data.set(player.id, playerData);
    }
    playerData.set(code, text);
}

function getAllCodes(player: Player): string[] {
    const playerData = data.get(player.id);
    if (!playerData) return [];
    return Array.from(playerData.keys());
}

function addToQueue(code: string, text: string, player: Player): void {
    let playerQueue = queue.get(player.id);
    if (!playerQueue) {
        playerQueue = new Map<string, string>();
        queue.set(player.id, playerQueue);
    }
    playerQueue.set(code, text);
}

function popFromQueue(player: Player): { code: string; text: string } | undefined {
    const playerQueue = queue.get(player.id);
    if (!playerQueue || playerQueue.size === 0) return undefined;
    const firstKey = playerQueue.keys().next().value;
    if (!firstKey) return undefined;
    const text = playerQueue.get(firstKey) as string;
    playerQueue.delete(firstKey);
    if (playerQueue.size === 0) queue.delete(player.id);
    return { code: firstKey, text };
}

function getPlayersWithQueue(): Player[] {
    return world.getAllPlayers().filter((player) => queue.has(player.id));
}

world.afterEvents.playerLeave.subscribe(({ playerId: id }) => data.delete(id) && queue.delete(id));
