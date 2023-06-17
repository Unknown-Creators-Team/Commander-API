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
    if (!(player instanceof Minecraft.Player)) return Error("player needs Player Class");
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
        } catch {}

        // score
        try {
            const score = text.split("{score:")[1].split(/(}|,})/i)[0];
            const str = `${score}}`;
            const object = easySafeParse(str);
            if (Object.values(object).length === 0) {
                if (score) text = text.replace(new RegExp(`({score:${score}}|{score:${score},})`, "i"), getScore(player, score));
            } else if (Object.values(object).length > 0) {
                const playerName = object.name || player;
                const objectName = object.object;
                text = text.replace(new RegExp(`({score:${score}}|{score:${score},})`, "i"), getScore(playerName, objectName));
            }
            
        } catch (e) {}

        // calc
        try {
            const calc = text.split("{calc:")[1].split(/(}|,})/i)[0];
            if (calc && stringCalc(calc)) text = text.replace(new RegExp(`({calc:${calc}}|{calc:${calc},})`, "i"), `${stringCalc(calc)}`);
        } catch {}

        // dimension
        try {
            const dimension = Number(text.split("{dimension:")[1].split(/(}|,})/i)[0]);
            if (typeof(dimension) === "number") {
                if (dimension === 0) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "overworld");
                if (dimension === -1) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "nether");
                if (dimension === 1) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "end");
                if (![-1, 0, 1].includes(dimension)) text = text.replace(new RegExp(`({dimension:${dimension}}|{dimension:${dimension},})`, "i"), "null");
            }
        } catch {}
        
        if (dataLength - i === 1) return text;
    }
}

export const safeParse = (object) => {
    return JSON.parse(object);
}

export const easySafeParse = (object) => {
    return ESON.parse(object);
}

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
            if (type.startsWith("r")) pos = player.getRotation()[type.replace("r","")] + num;
                else pos = player.location[type] + num;
        } else pos = Number(pos);
    } else if (type.startsWith("r")) pos = player.getRotation()[type.replace("r","")];
        else pos = player.location[type];
    
    return pos;
}   

/**
 * 
 * @param { string } str 
 * @returns { number | string | undefined }
 */
const stringCalc = (str) => {
    if (str.match(/[^0-9-+*/% ]/g)) return false;
    str = str.split(" ");
    let result = Number(str[0]);
    for (let i = 1; i < str.length;i++) {
      if (str[i]==="+") { result += Number(str[i+1]); i++;
      } else if (str[i]==="-") { result -= Number(str[i+1]); i++;
      } else if (str[i]==="**") { result **= Number(str[i+1]); i++;
      } else if (str[i]==="*") { result *= Number(str[i+1]); i++;
      } else if (str[i]==="/") { result /= Number(str[i+1]); i++;
      } else if (str[i]==="%") { result %= Number(str[i+1]); i++;
      }
    }
    return result;
}



/**
 * get score
 * @param { Minecraft.Entity | string } target target
 * @param { string } objective object name
 * @returns { number | undefined }
 */
export function getScore(target, objective) {
    // if target is a string, get the score by name
    if (typeof(target) === "string") {
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
            const score = target.scoreboardIdentity.getScore(world.scoreboard.getObjective(objective));
            // return the score value
            if (score) return score;
                else return undefined;
        } catch (e) { return undefined; }
    }
}