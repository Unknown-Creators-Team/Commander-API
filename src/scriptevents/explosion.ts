import { Block, Entity } from "@minecraft/server";
import { bothParse, setVariable } from "../util";


export default function main(source: Entity | Block | undefined, message: string) {    
    const object: Explosion = bothParse(message);


    if (object.radius === undefined) throw new Error("Radius is required.");

    const radius = Number(object.radius);
}

interface Explosion {
    radius: string | number;
    x?: string | number;
    y?: string | number;
    z?: string | number;
    options?: {
        allow_under_water?: string | boolean;
        breaks_blocks?: string | boolean;
        causes_fire?: string | boolean;
    }
}