import { Block, Entity } from "@minecraft/server";
import { Macro } from "lib/Macro.js";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("This event can only be called by a player");

    const text = Macro.format(source, message);

    const { successCount } = source.runCommand(`kick ${JSON.stringify(source.name)} ${text}`);

    // もしtextを含んだkickに失敗した場合、textが原因とみなしてtextを抜き、再度kickを試みる
    if (successCount <= 0) {
        const { successCount } = source.runCommand(`kick ${JSON.stringify(source.name)}`);
        if (successCount <= 0) {
            throw new Error("Failed to kick the player");
        }
    }

}
