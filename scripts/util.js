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

import { translate } from "./Data/translate.js";
import getScore from "./lib/getScore.js";

export function setVariable(player, source) {
    const dataLength = [...source].filter(t => t === "{").length;
    for (let i = 0; i < dataLength; i++) {
        source = source.replace("{name}", player.name);
        source = source.replace("{nl}", `\n`);

        // score
        try {
            const score = source.split("{score:")[1].split("}")[0];
            if (score) source = source.replace(`{score:${score}}`, getScore(player, score));
        } catch {}

        // tag
        try {
            const tag = source.split("{tag:")[1].split("}")[0];
            const hasTag = player.getTags().find(t => t.startsWith(tag));
            if (tag) source = source.replace(`{tag:${tag}}`, hasTag.slice(tag.length + 1));
        } catch {}
    }
    return source;
}

/**
 * 
 * @param { string } data
 * @param { string } key
 * @returns { {"error": string | undefined , "data": any | undefined, "translate": string | undefined} }
 * 
 * @author arutaka1220 
 */
export function parse(data, key) {
    data = data.replace(`${key}:`,"").replace(/'/g, "\"").replace(/`/g, "\"");

    try {
        const parsed = JSON.parse(data);

        return {"data": parsed};
    } catch (e) {
        const errorKey = String(e).split(":")[0];
        let translated = translate[errorKey];

        console.warn(e.stack);

        if(translated) translated = translated(String(e).split(":")[1]);
        else translated = errorKey;

        return {"error": e, "translate": translated};
    }
}