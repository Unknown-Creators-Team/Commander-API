import * as Minecraft from "@minecraft/server";
import { setVariable, easySafeParse, bothParse } from "./util";

const { world, system } = Minecraft;


system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { message, sourceEntity: player, sourceBlock: block } = event;
    const id = event.id.split(":").slice(1).join(":");

    const source = player as Minecraft.Player ?? block;

    if (!(source instanceof Minecraft.Player) && !block) return;

    world.sendMessage(`Received event ${id} from ${source instanceof Minecraft.Player ? source.name : "block"}: ${message}`);

    try {
        switch (id) {
            case "rename": {
                if (!source.isPlayer()) throw new Error("Cannot rename a non-player entity.");
                source.nameTag = setVariable(source, message) ?? message;
                break;
            }
            case "resetname":
            case "reset_name":
            case "reset":
            case "resetName": {
                if (!source.isPlayer()) throw new Error("Cannot rename a non-player entity.");
                source.nameTag = source.name;
                break;
            }
            case "setItem": {
                if (!source.isPlayer()) throw new Error("Cannot set item to a non-player entity.");
                const container = source.getComponent("inventory")?.container;
                if (!container) throw new Error("Player does not have an inventory container.");

                try {
                    const itemObject = bothParse(message);
                    if (!itemObject.item) return;
                    const amount = itemObject.amount ? Number(itemObject.amount) : 1;
                    const slot = itemObject.slot ? Number(itemObject.slot) : false;
                    const itemName = itemObject.item;//.replace("minecraft:", "");
                    const item = new Minecraft.ItemStack(itemName, amount);
                    if (itemObject.name) item.nameTag = setVariable(source, itemObject.name);
                    if (itemObject.lore) {
                        for (let v in itemObject.lore) itemObject.lore[v] = setVariable(source, itemObject.lore[v]);
                        item.setLore(itemObject.lore);
                    }
                    if (itemObject.enchants) {
                        const enchantments = item.getComponent("enchantable");
                        for (let i = 0; i < itemObject.enchants.length; i++) {
                            if (!itemObject.enchants[i].name) return;
                            let enchantsName = itemObject.enchants[i].name;
                            let enchantsLevel = 1;
                            if (itemObject.enchants[i].level) enchantsLevel = Number(itemObject.enchants[i].level);
                            enchantments?.addEnchantment({ "type": enchantsName, "level": enchantsLevel });
                        }
                    }
                    if (itemObject.can_place_on) item.setCanPlaceOn(itemObject.can_place_on);
                    if (itemObject.can_destroy) item.setCanDestroy(itemObject.can_destroy);
                    if (itemObject.lock) item.lockMode = Minecraft.ItemLockMode[itemObject.lock as keyof typeof Minecraft.ItemLockMode];
                    if (itemObject.keep_on_death) item.keepOnDeath = itemObject.keep_on_death === "true" ? true : false;
                    if (typeof slot == "number") container.setItem(slot, item);
                    else container.addItem(item);
                } catch (e) {
                    console.error(e, (e as Error).stack);
                    source.sendMessage(`§c${e}`);
                    for (const ply of world.getPlayers({ tags: ["Capi:hasOp"] })) ply.sendMessage(`§c${e}`);
                }
                break;
            }
            case "form": {
                
                break;
            }
        }
        // if (id === "rename") {
        //     if (source.isPlayer()) {
        //         source.nameTag = setVariable(source, message) ?? message;
        //         source.nameTag = message;
        //     } else {
        //         throw new Error("Cannot rename a non-player entity.");
        //     }
        // }
        // else if (id === "resetName") {
        //     if (source.isPlayer()) {
        //         source.nameTag = source.name;
        //     } else {
        //         throw new Error("Cannot rename a non-player entity.");
        //     }
        // }
        // else if (id === "setItem") {
        //     if (source.isPlayer()) {
        //         const container = source.getComponent("inventory")?.container;
        //         if (!container) throw new Error("Player does not have an inventory container.");
    
        //         try {
        //             const itemObject = easySafeParse(message);
        //             if (!itemObject.item) return;
        //             const amount = itemObject.amount ? Number(itemObject.amount) : 1;
        //             const slot = itemObject.slot ? Number(itemObject.slot) : false;
        //             const itemName = itemObject.item;//.replace("minecraft:", "");
        //             const item = new Minecraft.ItemStack(itemName, amount);
        //             if (itemObject.name) item.nameTag = setVariable(source, itemObject.name);
        //             if (itemObject.lore) {
        //                 for (let v in itemObject.lore) itemObject.lore[v] = setVariable(source, itemObject.lore[v]);
        //                 item.setLore(itemObject.lore);
        //             }
        //             if (itemObject.enchants) {
        //                 const enchantments = item.getComponent("enchantable");
        //                 for (let i = 0; i < itemObject.enchants.length; i++) {
        //                     if (!itemObject.enchants[i].name) return;
        //                     let enchantsName = itemObject.enchants[i].name;
        //                     let enchantsLevel = 1;
        //                     if (itemObject.enchants[i].level) enchantsLevel = Number(itemObject.enchants[i].level);
        //                     enchantments?.addEnchantment({ "type": enchantsName, "level": enchantsLevel });
        //                 }
        //             }
        //             if (itemObject.can_place_on) item.setCanPlaceOn(itemObject.can_place_on);
        //             if (itemObject.can_destroy) item.setCanDestroy(itemObject.can_destroy);
        //             if (itemObject.lock) item.lockMode = Minecraft.ItemLockMode[itemObject.lock as keyof typeof Minecraft.ItemLockMode];
        //             if (itemObject.keep_on_death) item.keepOnDeath = itemObject.keep_on_death === "true" ? true : false;
        //             if (typeof slot == "number") container.setItem(slot, item);
        //             else container.addItem(item);
        //         } catch (e) {
        //             console.error(e, (e as Error).stack);
        //             source.sendMessage(`§c${e}`);
        //             for (const ply of world.getPlayers({ tags: ["Capi:hasOp"] })) ply.sendMessage(`§c${e}`);
        //         }
        //     } else {
        //         throw new Error("Cannot set item to a non-player entity.");
        //     }
        // }
        // else if (id === "form") {
            
        // }
    } catch (e) {
        console.error(e, (e as Error).stack);
        if (source.isPlayer()) source.sendMessage(`§c${e}`);
        for (const ply of world.getPlayers({ tags: ["Capi:hasOp"] })) ply.sendMessage(`§c${e}`);
    }
    
}, { namespaces: ["capi", "Capi", "cApi", "CApi", "c-api", "C-api"] });