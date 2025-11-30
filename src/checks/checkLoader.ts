import { world } from "@minecraft/server";
import checks from "../data/checks.js";

console.warn("checkloader loadddddd");

import "./blockBreak";

// world.afterEvents.worldLoad.subscribe((ev) => {
//     for (const check of checks) {
//         import(`./${check}`)
//             .then(() => {
//                 console.warn(`Test "${check}" loaded`);
//             })
//             .catch((e) => {
//                 console.error(`Test "${check}" failed to load: ${e}`);
//             });
//     }
// });
