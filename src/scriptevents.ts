import * as Minecraft from "@minecraft/server";
import { setVariable } from "./util";

const { world, system } = Minecraft;


system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { message, sourceEntity: player, sourceBlock: block } = event;
    const id = event.id.split(":").slice(1).join(":");

    const source = player as Minecraft.Player ?? block;

    if (!(source instanceof Minecraft.Player) && !block) return;

    world.sendMessage(`Received event ${id} from ${source instanceof Minecraft.Player ? source.name : "block"}: ${message}`);


    if (id === "rename") {
        if (source.isPlayer()) {
            source.nameTag = setVariable(source, message);
            source.nameTag = message;
        }
    }
    else if (id === "resetName") {
        if (source.isPlayer()) {
            source.nameTag = source.name;
        }
    }
    else if (id === "setItem") {
        if (source.isPlayer()) {
            const container = source.getComponent("inventory").container;
            if (!container) throw new Error("Player does not have an inventory container.");

            source.inventory.setItem(0, message);
        }
    }
}, { namespaces: ["capi", "Capi", "cApi", "CApi", "c-api", "C-api"] });