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
import getScore from "./lib/getScore.js";


/**
 * @param { Minecraft.Player } player
 * @param { string } text 
 * @returns { string }
 */
export function setVariable(player, text) {
    if (!text?.length) return text;
    const dataLength = text.split("").filter(t => t === "{").length;
    for (let i = 0; i < dataLength; i++) {
        text = text.replace("{name}", player.name);
        text = text.replace("{nametag}", player.nameTag);
        text = text.replace("{nl}", `\n`);

        // tag
        try {
            const tag = text.split("{tag:")[1].split("}")[0];
            const hasTag = player.getTags().find(t => t.split(":")[0] === tag);
            if (tag) text = text.replace(`{tag:${tag}}`, hasTag.slice(tag.length + 1));
        } catch {}

        // score
        try {
            const score = text.split("{score:")[1].split("}")[0];
            if (score) text = text.replace(`{score:${score}}`, getScore(player, score));
        } catch {}

        // calc
        try {
            const calc = text.split("{calc:")[1].split("}")[0];
            if (calc) text = text.replace(`{calc:${calc}}`, `${stringCalc(calc)}`);
        } catch {}

        // dimension
        try {
            const dimension = Number(text.split("{dimension:")[1].split("}")[0]);
            if (typeof(dimension) === "number") {
                if (dimension === 0) text = text.replace(`{dimension:${dimension}}`, "overworld");
                if (dimension === -1) text = text.replace(`{dimension:${dimension}}`, "nether");
                if (dimension === 1) text = text.replace(`{dimension:${dimension}}`, "end");
                if (![-1, 0, 1].includes(dimension)) dimension = text.replace(`{dimension:${dimension}}`, "null");
            }
        } catch {}
    }
    return text;
}

export const safeParse = (object) => {
    return new Promise((resolve, reject) => {
        try { resolve(JSON.parse(object))
        } catch (e) { reject(e) }
    });
}

export const easySafeParse = (object) => {
    return new Promise((resolve, reject) => {
        try { resolve(ESON.parse(object))
        } catch (e) { reject(e) }
    });
}

/**
 * 
 * @param { string } pos pos
 * @param { Minecraft.Player } player player object
 * @param {( "x" | "y" | "z" | "rx" | "ry" )} type type of pos
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
    if (str.match(/[^0-9-+*/% ]/g)) return str;
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