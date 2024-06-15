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

/**
 *
 * @param {Minecraft.Player} player
 * @param {string} text
 * @returns
 */
export function setVariable(player, text) {
    if (!(player instanceof Minecraft.Player)) throw Error("player needs Player Class");
    if (!text?.length) return text;
    const dataLength = text.split("").filter((t) => t === "{").length;

    if (!dataLength) return text;

    for (let i = 0; i < dataLength; i++) {
        text = text.replace(/({name}|{name,})/i, player.name);
        text = text.replace(/({nametag}|{nametag,})/i, player.nameTag);
        text = text.replace(/({nl}|{nl,})/i, `\n`);

        // tag
        try {
            const tag = text.split("{tag:")[1].split(/(}|,})/i)[0];
            const hasTag = player.getTags().find((t) => t.split(":")[0] === tag);
            if (tag) text = text.replace(new RegExp(`({tag:${tag}}|{tag:${tag},})`, "i"), hasTag.slice(tag.length + 1));
        } catch {}

        // score
        try {
            const score = text.split("{score:")[1].split(/(}|,})/i)[0];
            console.warn(score);
            const str = `${score}}`;
            const object = easySafeParse(str);
            if (Object.values(object).length === 0) {
                console.warn("object", object);
                console.warn("score", getScore(player, score));

                if (score)
                    text = text.replace(
                        new RegExp(`({score:${score}}|{score:${score},})`, "i"),
                        getScore(player, score).toString()
                    );
            } else if (Object.values(object).length > 0) {
                const playerName = object.name || player;
                const objectName = object.object;
                text = text.replace(
                    new RegExp(`({score:${score}}|{score:${score},})`, "i"),
                    getScore(playerName, objectName).toString()
                );
            }
        } catch (e) {}

        // calc
        try {
            const calc = text.split("{calc:")[1].split(/(}|,})/i)[0];
            const answer = calculate(calc);
            if (calc && !isNaN(answer)) {
                text = text.replace(new RegExp(`({calc:${escapeRegExp(calc)}}|{calc:${escapeRegExp(calc)},})`), answer.toString());
                
                function escapeRegExp(string) {
                  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
            }
                
        } catch {}

        // dimension
        try {
            const dimension = Number(text.split("{dimension:")[1].split(/(}|,})/i)[0]);
            if (typeof dimension === "number") {
                if (dimension === 0)
                    text = text.replace(
                        new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"),
                        "overworld"
                    );
                if (dimension === -1)
                    text = text.replace(
                        new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"),
                        "nether"
                    );
                if (dimension === 1)
                    text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "end");
                if (![-1, 0, 1].includes(dimension))
                    text = text.replace(
                        new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"),
                        "null"
                    );
            }
        } catch {}

        if (dataLength - i === 1) return text;
    }
}

export const safeParse = (object) => {
    return JSON.parse(object);
};

export const easySafeParse = (object) => {
    return ESON.parse(object);
};

/**
 *
 * @param { string } pos pos
 * @param { Minecraft.Player } player player object
 * @param {( "x" | "y" | "z" | "rx" | "ry" )} type type of pos
 *
 * @returns { number }
 */
export const parsePos = (pos, player, type) => {
    if (pos) {
        if (pos?.startsWith("~")) {
            const num = Number(pos.replace(/~/g, ""));
            if (type.startsWith("r")) pos = player.getRotation()[type.replace("r", "")] + num;
            else pos = player.location[type] + num;
        } else pos = Number(pos);
    } else if (type.startsWith("r")) pos = player.getRotation()[type.replace("r", "")];
    else pos = player.location[type];

    return pos;
};

/**
 *
 * @param { string } str
 * @returns { number | string | undefined }
 */
function calculate(expression) {
    const operatorPrecedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "**": 3,
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

    const operators = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
        "**": (a, b) => Math.pow(a, b),
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

    // Add 0 before - at the start of the expression or after (
    expression = expression.replace(/^-\d+|\(-\d+/g, (match) => "0" + match);

    const tokens = expression.match(/sqrt|abs|asin|acos|atan|sin|cos|tan|round|floor|ceil|log10|log2|\*\*|\d+|\S/g);
    const outputQueue = [];
    const operatorStack = [];

    tokens.forEach((token) => {
        if (!isNaN(Number(token))) {
            outputQueue.push(Number(token));
        } else if (token in operatorPrecedence) {
            while (
                operatorStack.length &&
                operatorPrecedence[token] <= operatorPrecedence[operatorStack[operatorStack.length - 1]]
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue.push(operatorStack.pop());
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
        outputQueue.push(operator);
    }

    const calculationStack = [];

    outputQueue.forEach((token) => {
        if (typeof token === "number") {
            calculationStack.push(token);
        } else {
            const b = calculationStack.pop();
            const a = [
                "sqrt",
                "abs",
                "asin",
                "acos",
                "atan",
                "sin",
                "cos",
                "tan",
                "round",
                "floor",
                "ceil",
                "log10",
                "log2",
            ].includes(token)
                ? b
                : calculationStack.pop();
            calculationStack.push(operators[token](a, b));
        }
    });

    return calculationStack.pop();
}



/**
 * get score
 * @param { Minecraft.Entity | string } target target
 * @param { string } objective object name
 * @returns { number | undefined }
 */
export function getScore(target, objective) {
    // if target is a string, get the score by name
    if (typeof target === "string") {
        // get all scores in the objective
        const scores = world.scoreboard.getObjective(objective).getScores();
        // find the score with the matching name
        const score = scores.find(({ participant }) => participant.displayName === target);
        // return the score value
        if (typeof score === "number") return score.score;
            else return undefined;
    } else {
        // if target is a player, get the score by player
        try {
            // get the score by player
            const score = world.scoreboard.getObjective(objective).getScore(target);
            // return the score value
            if (typeof score === "number") return score;
                else return undefined;
        } catch (e) {
            return undefined;
        }
    }
}
