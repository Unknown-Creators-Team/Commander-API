/**
 *
 * ░█████╗░░█████╗░███╗░░░███╗███╗░░░███╗░█████╗░███╗░░██╗██████╗░███████╗██████╗░  ░█████╗░██████╗░██╗
 * ██╔══██╗██╔══██╗████╗░████║████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝██╔══██╗  ██╔══██╗██╔══██╗██║
 * ██║░░╚═╝██║░░██║██╔████╔██║██╔████╔██║███████║██╔██╗██║██║░░██║█████╗░░██████╔╝  ███████║██████╔╝██║
 * ██║░░██╗██║░░██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚████║██║░░██║██╔══╝░░██╔══██╗  ██╔══██║██╔═══╝░██║
 * ╚█████╔╝╚█████╔╝██║░╚═╝░██║██║░╚═╝░██║██║░░██║██║░╚███║██████╔╝███████╗██║░░██║  ██║░░██║██║░░░░░██║
 * ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░╚══════╝╚═╝░░╚═╝  ╚═╝░░╚═╝╚═╝░░░░░╚═╝
 *
 * @LICENSE GNU General Public License v3.0
 * @AUTHOR Nano
 * @AUTHOR arutaka1220
 * @LINK https://github.com/191225/Commander-API
 */

import * as Minecraft from "@minecraft/server";
import ESON from "./lib/ESON.js";
import { FMath } from "lib/FastMath.js";

const { world, system } = Minecraft;

export function format(player: Minecraft.Player | Minecraft.Entity | Minecraft.Block | undefined, text: string) {
    // if (!(player instanceof Minecraft.Player)) throw Error("player needs Player Class");
    if (!text?.length) return text;
    const dataLength = text.split("").filter((t) => t === "{").length;

    if (!dataLength) return text;

    for (let i = 0; i < dataLength; i++) {
        if (player?.isPlayer()) {
            text = text.replace(/({name}|{name,})/i, player.name);
        } else if (player?.isBlock() || player?.isEntity()) {
            text = text.replace(/({name}|{name,})/i, player.typeId);
        }

        if (player?.isPlayer() || player?.isEntity()) {
            text = text.replace(/({nametag}|{nametag,})/i, player.nameTag);
        } else if (player?.isBlock()) {
            text = text.replace(/({nametag}|{nametag,})/i, player.typeId);
        }

        text = text.replace(/({nl}|{nl,})/i, `\n`);

        // tag
        try {
            if (player?.isPlayer() || player?.isEntity()) {
                const tag = text.split("{tag:")[1].split(/(}|,})/i)[0];
                const hasTag = player.getTags().find((t) => t.split(":")[0] === tag);
                if (tag) text = text.replace(new RegExp(`({tag:${tag}}|{tag:${tag},})`, "i"), hasTag?.slice(tag.length + 1) ?? "null");
            }
        } catch {}

        // score
        try {
            const score = text.split("{score:")[1].split(/(}|,})/i)[0];
            const str = `${score}}`;
            const object = easySafeParse(str);
            if (Object.values(object).length === 0 && (player?.isPlayer() || player?.isEntity())) {
                if (score) {
                    text = text.replace(new RegExp(`({score:${score}}|{score:${score},})`, "i"), getScore(player, score)?.toString() ?? "null");
                }
            } else if (Object.values(object).length > 0) {
                const playerName = object.name || player;
                const objectName = object.object;
                text = text.replace(new RegExp(`({score:${str}}|{score:${str},})`, "i"), getScore(playerName, objectName)?.toString() ?? "null");
            }
        } catch (e) {}

        // velocity
        try {
            if (player?.isEntity()) {
                const { x, y, z } = player.getVelocity();
                const v = {
                    x,
                    y,
                    z,
                    xy: FMath.hypot(x, y),
                    xz: FMath.hypot(x, z),
                    yz: FMath.hypot(y, z),
                    xyz: FMath.hypot(x, y, z),
                };

                const velocity = [...text.split("{velocity:")[1].split(/(}|,})/i)[0]].sort((a, b) => a.localeCompare(b)).join("");
                text = text.replace(
                    new RegExp(`({velocity:${velocity}}|{velocity:${velocity},})`, "i"),
                    v[velocity as keyof typeof v]?.toString() ?? "null"
                );
            }
        } catch {}

        // calc
        try {
            const calc = text.split("{calc:")[1].split(/(}|,})/i)[0];
            const answer = calculate(calc);
            if (calc && !isNaN(answer)) {
                text = text.replace(new RegExp(`({calc:${escapeRegExp(calc)}}|{calc:${escapeRegExp(calc)},})`), answer.toString());

                function escapeRegExp(string: string): string {
                    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                }
            }
        } catch {}

        // dimension
        try {
            const dimension = Number(text.split("{dimension:")[1].split(/(}|,})/i)[0]);
            if (typeof dimension === "number") {
                if (dimension === 0) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "overworld");
                if (dimension === -1) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "nether");
                if (dimension === 1) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "end");
                if (![-1, 0, 1].includes(dimension))
                    text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "null");
            }
        } catch {}

        if (dataLength - i === 1) return text;
    }
}

export const safeParse = <T extends Object>(object: string): T => {
    return JSON.parse(object);
};

export const easySafeParse = (object: string): any => {
    return ESON.parse(object);
};

export function bothParse(object: string): any {
    try {
        return safeParse(object);
    } catch {
        try {
            return easySafeParse(object);
        } catch {
            throw new Error("Failed to parse object");
        }
    }
}

export const parsePos = (pos: string, player: Minecraft.Entity | Minecraft.Block | undefined, type: "x" | "y" | "z" | "rx" | "ry"): number => {
    let resultPos = 0;
    if (pos) {
        if (pos?.startsWith("~")) {
            const num = Number(pos.replace(/~/g, ""));
            if (type.startsWith("r") && player?.isEntity()) resultPos = player.getRotation()[type.replace("r", "") as "x" | "y"] + num;
            else if (player?.isEntity() || player?.isBlock()) resultPos = player.location[type as keyof Minecraft.Vector2] + num;
            else resultPos = num;
        } else resultPos = Number(pos);
    } else if (type.startsWith("r") && player?.isEntity()) resultPos = player.getRotation()[type.replace("r", "") as "x" | "y"];
    else if (player?.isEntity() || player?.isBlock()) resultPos = player.location[type as keyof Minecraft.Vector2];
    else resultPos = 0;

    return resultPos;
};

function calculate(expression: string): number {
    const operatorPrecedence: { [key: string]: number } = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "%": 2,
        "//": 2,
        "**": 3,
        "^": 3,
        sqrt: 4,
        sin: 4,
        cos: 4,
        tan: 4,
        asin: 4,
        acos: 4,
        atan: 4,
        abs: 4,
        round: 4,
        floor: 4,
        ceil: 4,
        log10: 4,
        log2: 4,
    };

    const operators: { [key: string]: (a: number, b?: number) => number } = {
        "+": (a, b = 0) => a + b,
        "-": (a, b = 0) => a - b,
        "*": (a, b = 0) => a * b,
        "/": (a, b = 1) => a / b,
        "%": (a, b = 1) => a % b,
        "//": (a, b = 1) => Math.floor(a / b),
        "**": (a, b = 1) => Math.pow(a, b),
        "^": (a, b = 1) => Math.pow(a, b),
        sqrt: (a) => Math.sqrt(a),
        sin: (a) => Math.sin(a),
        cos: (a) => Math.cos(a),
        tan: (a) => Math.tan(a),
        asin: (a) => Math.asin(a),
        acos: (a) => Math.acos(a),
        atan: (a) => Math.atan(a),
        abs: (a) => Math.abs(a),
        round: (a) => Math.round(a),
        floor: (a) => Math.floor(a),
        ceil: (a) => Math.ceil(a),
        log10: (a) => Math.log10(a),
        log2: (a) => Math.log2(a),
    };

    expression = expression.replace(/^-\d+|\(-\d+/g, (match) => "0" + match);
    const tokens = expression.match(/\/\/|sqrt|abs|asin|acos|atan|sin|cos|tan|round|floor|ceil|log10|log2|\*\*|\^|\d*\.?\d+|\S/g);
    if (!tokens) {
        throw new Error("Invalid expression");
    }
    const outputQueue: (number | string)[] = [];
    const operatorStack: string[] = [];

    tokens.forEach((token) => {
        if (!isNaN(Number(token))) {
            outputQueue.push(Number(token));
        } else if (token in operatorPrecedence) {
            while (operatorStack.length && operatorPrecedence[token] <= operatorPrecedence[operatorStack[operatorStack.length - 1]]) {
                outputQueue.push(operatorStack.pop()!);
            }
            operatorStack.push(token);
        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue.push(operatorStack.pop()!);
            }
            if (operatorStack.pop() !== "(") {
                throw new Error("Mismatched parentheses");
            }
        } else {
            throw new Error(`Unknown token: ${token}`);
        }
    });

    while (operatorStack.length) {
        const operator = operatorStack.pop();
        if (operator === "(" || operator === ")") {
            throw new Error("Mismatched parentheses");
        }
        outputQueue.push(operator!);
    }

    const calculationStack: number[] = [];

    outputQueue.forEach((token) => {
        if (typeof token === "number") {
            calculationStack.push(token);
        } else if (["sqrt", "abs", "asin", "acos", "atan", "sin", "cos", "tan", "round", "floor", "ceil", "log10", "log2"].includes(token)) {
            const a = calculationStack.pop();
            if (a === undefined) {
                throw new Error("Invalid operation");
            }
            const result = operators[token](a);
            calculationStack.push(result);
        } else {
            const b = calculationStack.pop();
            const a = calculationStack.pop();
            if (
                b === undefined ||
                (a === undefined &&
                    !["sqrt", "abs", "asin", "acos", "atan", "sin", "cos", "tan", "round", "floor", "ceil", "log10", "log2"].includes(token))
            ) {
                throw new Error("Invalid operation");
            }
            const result = operators[token](a ?? b, b);
            calculationStack.push(result);
        }
    });

    return calculationStack.pop()!;
}

export function getScore(target: Minecraft.Entity | string, objective: string): number | undefined {
    // if target is a string, get the score by name
    if (typeof target === "string") {
        // get all scores in the objective
        const scores = world.scoreboard.getObjective(objective)?.getScores();
        // find the score with the matching name
        const score = scores?.find(({ participant }) => participant.displayName === target)?.score;
        // return the score value
        if (typeof score === "number") return score;
        else return undefined;
    } else {
        // if target is a player, get the score by player
        try {
            // get the score by player
            const score = world.scoreboard.getObjective(objective)?.getScore(target);
            // return the score value
            if (typeof score === "number") return score;
            else return undefined;
        } catch (e) {
            return undefined;
        }
    }
}

export function setScore(target: Minecraft.Entity | Minecraft.ScoreboardIdentity | string, objective: string, score: number): void {
    const object = world.scoreboard.getObjective(objective);
    if (!object) {
        world.scoreboard.addObjective(objective);
        return setScore(target, objective, score);
    }

    score = FMath.max(FMath.min(score, 2 ** 31 - 1), (-2) ** 31);
    object.setScore(target, score);
}

export function addScore(target: Minecraft.Entity | Minecraft.ScoreboardIdentity | string, objective: string, score: number): void {
    const object = world.scoreboard.getObjective(objective);
    if (!object) {
        world.scoreboard.addObjective(objective);
        return addScore(target, objective, score);
    }

    object.addScore(target, score);
}

export function isTrue(value: any): boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    if (typeof value === "number") return value === 1;
    return false;
}

export function promiseDelay(callback: (...value: any[]) => any, ...value: any[]): void {
    Promise.resolve().then(() => callback(...value));
}

export function removeTagsStartsWith(player: Minecraft.Player, ...tags: string[]): void {
    for (const t of player.getTags()) {
        for (const tag of tags) {
            if (t.startsWith(tag)) player.removeTag(t);
        }
    }
}