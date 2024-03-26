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

const { world, system } = Minecraft;

export function setVariable(player: Minecraft.Player, text: string) {
    if (!(player instanceof Minecraft.Player)) throw Error("player needs Player Class");
    if (!text?.length) return text;
    const dataLength = text.split("").filter(t => t === "{").length;

    if (!dataLength) return text;

    for (let i = 0; i < dataLength; i++) {
        text = text.replace(/({name}|{name,})/i, player.name);
        text = text.replace(/({nametag}|{nametag,})/i, player.nameTag);
        text = text.replace(/({nl}|{nl,})/i, `\n`);

        // tag
        try {
            const tag = text.split("{tag:")[1].split(/(}|,})/i)[0];
            const hasTag = player.getTags().find(t => t.split(":")[0] === tag);
            if (tag) text = text.replace(new RegExp(`({tag:${tag}}|{tag:${tag},})`, "i"), hasTag.slice(tag.length + 1));
        } catch { }

        // score
        try {
            const score = text.split("{score:")[1].split(/(}|,})/i)[0];
            const str = `${score}}`;
            const object = easySafeParse(str);
            if (Object.values(object).length === 0) {
                if (score) text = text.replace(new RegExp(`({score:${score}}|{score:${score},})`, "i"), getScore(player, score).toString());
            } else if (Object.values(object).length > 0) {
                const playerName = object.name || player;
                const objectName = object.object;
                text = text.replace(new RegExp(`({score:${score}}|{score:${score},})`, "i"), getScore(playerName, objectName).toString());
            }

        } catch (e) { }

        // calc
        try {
            const calc = text.split("{calc:")[1].split(/(}|,})/i)[0];
            if (calc && calculateString(calc)) text = text.replace(new RegExp(`({calc:${calc}}|{calc:${calc},})`, "i"), `${calculateString(calc)}`);
        } catch { }

        // dimension
        try {
            const dimension = Number(text.split("{dimension:")[1].split(/(}|,})/i)[0]);
            if (typeof (dimension) === "number") {
                if (dimension === 0) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "overworld");
                if (dimension === -1) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "nether");
                if (dimension === 1) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "end");
                if (![-1, 0, 1].includes(dimension)) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "null");
            }
        } catch { }

        if (dataLength - i === 1) return text;
    }
}

export const safeParse = <T extends Object>(object: string): T => {
    return JSON.parse(object);
}

export const easySafeParse = (object: string): any => {
    return ESON.parse(object);
}

export const parsePos = (pos: string, player: { "location": Minecraft.Vector3, "getRotation"?: () => Minecraft.Vector2 }, type: "x" | "y" | "z" | "rx" | "ry"): number => {
    let resultPos = 0;

    if (pos) {
        if (pos?.startsWith("~")) {
            const num = Number(pos.replace(/~/g, ""));
            if (type.startsWith("r") && "getRotation" in player) resultPos = player.getRotation()[type.replace("r", "")] + num;
            else resultPos = player.location[type] + num;
        } else resultPos = Number(pos);
    } else if (type.startsWith("r")) resultPos = player.getRotation()[type.replace("r", "")];
    else resultPos = player.location[type];

    return resultPos;
}

function calculateString(expression) {
    const operatorPrecedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '**': 3
    };

    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '**': (a, b) => Math.pow(a, b)
    };

    const tokens = expression.match(/\d+|\*\*|\(|\)|\S/g);
    const outputQueue = [];
    const operatorStack = [];

    tokens.forEach(token => {
        if (!isNaN(Number(token))) {
            outputQueue.push(Number(token));
        } else if (token in operatorPrecedence) {
            while (operatorStack.length && operatorPrecedence[token] <= operatorPrecedence[operatorStack[operatorStack.length - 1]]) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack.pop() !== '(') {
                throw new Error('Mismatched parentheses');
            }
        } else {
            throw new Error(`Unknown token: ${token}`);
        }
    });

    while (operatorStack.length) {
        const operator = operatorStack.pop();
        if (operator === '(' || operator === ')') {
            throw new Error('Mismatched parentheses');
        }
        outputQueue.push(operator);
    }

    const calculationStack = [];

    outputQueue.forEach(token => {
        if (typeof token === 'number') {
            calculationStack.push(token);
        } else {
            const b = calculationStack.pop();
            const a = calculationStack.pop();
            calculationStack.push(operators[token](a, b));
        }
    });

    return calculationStack.pop();
}

export function getScore(target: Minecraft.Entity | string, objective: string): number | undefined {
    // if target is a string, get the score by name
    if (typeof (target) === "string") {
        // get all scores in the objective
        const scores = world.scoreboard.getObjective(objective).getScores();
        // find the score with the matching name
        const score = scores.find(({ participant }) => participant.displayName === target);
        // return the score value
        if (score) return score.score;
        else return undefined;
    } else {
        // if target is a player, get the score by player
        try {
            // get the score by player
            const score = world.scoreboard.getObjective(objective).getScore(target);
            // return the score value
            if (score) return score;
            else return undefined;
        } catch (e) { return undefined; }
    }
}