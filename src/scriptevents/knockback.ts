import { Block, Entity } from "@minecraft/server";
import { safeParse, setVariable } from "../util.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source || !source.isEntity()) throw new Error("Cannot teleport a non-entity.");

    const data = safeParse<
        | string[]
        | {
            directionX: any;
            directionZ: any;
            horizontalStrength: any;
            verticalStrength: any;
        }
    >(message);

    const directionX = String(setVariable(source, "directionX" in data ? data.directionX : data[0] || 0));
    const directionZ = String(setVariable(source, "directionZ" in data ? data.directionX : data[0] || 0));
    const horizontalStrength = String(setVariable(source, "horizontalStrength" in data ? data.directionX : data[0] || 1));
    const verticalStrength = String(setVariable(source, "verticalStrength" in data ? data.directionX : data[0] || 1));

    const parsedDiretionX = Number(directionX);
    const parsedDiretionZ = Number(directionZ);
    const parsedHorizontalStrength = Number(horizontalStrength);
    const parsedVerticalStrength = Number(verticalStrength);

    if (Number.isNaN(parsedDiretionX)) {
        throw new Error("Invalid directionX");
    }

    if (Number.isNaN(parsedDiretionZ)) {
        throw new Error("Invalid directionZ");
    }

    if (Number.isNaN(parsedHorizontalStrength)) {
        throw new Error("Invalid horizontalStrength");
    }

    if (Number.isNaN(parsedVerticalStrength)) {
        throw new Error("Invalid verticalStrength");
    }

    source.applyKnockback(
        parsedDiretionX,
        parsedDiretionZ,
        parsedHorizontalStrength,
        parsedVerticalStrength,
    );
}