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
 * @AUTHORS Nano, arutaka
 * @LINK https://github.com/191225/Commander-API
 */

import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";
import tickEvent from "./lib/TickEvent.js";
import getScore from "./lib/getScore.js";
import { Database, ExtendedDatabase } from "./lib/Database.js";
import { setVariable } from "./util.js";
import Config from "./config.js";
import { Menu } from "./ui.js";

const world = Minecraft.world;

tickEvent.subscribe("main", ({currentTick, deltaTime, tps}) => {
    for(const player of world.getPlayers()) {
        player.getTags().forEach((t) => {
            if (t.startsWith("rename:")) {
                player.rename = t.replace("rename:", "");
                player.removeTag(t);
            }
            if (t.startsWith("resetName")) {
                player.resetName = true;
                player.removeTag(t);
            }
            if (t.startsWith("setItem:")) {
                if (!player.setItemJson) player.setItemJson = [];
                player.setItemJson.push(t.replace("setItem:", "").replace(/'/g, '\"').replace(/`/g, "\""));
                player.removeTag(t);
            }
            if (t.startsWith("form:")) {
                player.formJson = t.replace("form:","").replace(/'/g, "\"").replace(/`/g, "\"");
                player.removeTag(t);
            }
            if (t.startsWith("run:")) {
                player.run = t.replace("run:","").replace(/'/g, "\"").replace(/`/g, "\"");
                player.removeTag(t);
            }
            if (t.startsWith("tell:")) {
                player.Tell = t.replace("tell:","").replace(/'/g, "\"").replace(/`/g, "\"");
                player.removeTag(t);
            }
            if (t.startsWith("kick:")) {
                player.kick = t.replace("kick:","").replace(/'/g, "\"").replace(/`/g, "\"");
                player.removeTag(t);
            }
        });

        // player.setScore = (type, object, score) => player.runCommandAsync(`scoreboard players ${type} @s ${object} ${score ? score : ""}`);
        player.setScore = (object, score = 0, type = "set") => {
            if(type==="set")try{world.scoreboard.setScore(object,player.scoreboard,score);}catch{
                player.runCommandAsync(`scoreboard players set @s ${object} ${score}`);}
                else player.runCommandAsync(`scoreboard players ${type} @s ${object} ${score}`);
            };

        // sneaking
        if (player.isSneaking) player.addTag("Capi:sneaking");
            else player.removeTag("Capi:sneaking");
        
        // tshoot
        if (player.hasTag("Capi:system_tshoot")) {
            player.getTags().forEach((t) => player.removeTag(t));
        }

        // Rename
        if (player.rename) {
            player.nameTag = setVariable(player, player.rename);
            player.rename = false;
        }

        // Reset name
        if (player.resetName) {
            player.nameTag = player.name;
            player.resetName = false;
        }

        // Set slot
        try {
            const setSlot = getScore(player, "Capi:setSlot");
            if (setSlot > -1) {
                player.selectedSlot = setSlot;
                player.setScore("Capi:setSlot", 0, "reset");
            }
        } catch {}

        // Set item
        const container = player.getComponent('inventory').container;
        if (player.setItemJson) player.setItemJson.forEach(setItemJson => { 
            const Data = JSON.parse(setItemJson);
            if (!Data.item) return;
            const amount = Data.amount ? Data.amount : 1;
            const data = Data.data ? Data.data : 0;
            const slot = Data.slot ? Data.slot : 0;
            const itemName = Data.item.replace("minecraft:", "");
            const item = new Minecraft.ItemStack(Minecraft.ItemTypes.get(itemName), amount, data);
            if (Data.name) item.nameTag = setVariable(player, Data.name);
            if (Data.lore) {
                for (let v in Data.lore) Data.lore[v] = setVariable(player, Data.lore[v]);
                item.setLore(setVariable(player, Data.lore));
            }
            if (Data.enchants) {
                const enchantments = item.getComponent("enchantments").enchantments;
                for (let i = 0; i < Data.enchants.length; i++) {
                    if (!Data.enchants[i].name) return;
                    let enchantsName = Data.enchants[i].name;
                    let enchantsLevel = 1;
                    if (Data.enchants[i].level) enchantsLevel = Data.enchants[i].level;
                    enchantments.addEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantsName], enchantsLevel));
                }
                item.getComponent("enchantments").enchantments = enchantments;
            }
            
            if (typeof Data.slot == "number") container.setItem(Data.slot, item);
                else container.addItem(item);
        });
        player.setItemJson = [];

        // Show form
        if (player.formJson) {
            const Data = JSON.parse(player.formJson);
            if (!Data.buttons) throw TypeError(`The button has not been passed. A button must be passed to display the form.`);
            
            const Form = new MinecraftUI.ActionFormData();
            if (Data.title) Form.title(String(setVariable(player, Data.title)));
            if (Data.body) Form.body(String(setVariable(player, Data.body)));
           
            Data.buttons.forEach(b => {
                if (!b.text) throw TypeError(`The button text is not passed.`);
                if (b.textures) Form.button(String(setVariable(player, b.text)), String(b.textures));
                    else Form.button(String(setVariable(player, b.text)));
            });

            Form.show(player).then(response => player.addTag((Data.buttons[response.selection].tag)));
            player.formJson = false;
        }

        // Run command
        if (player.run) {
            const Data = JSON.parse(player.run);
            Data.forEach(c => player.runCommandAsync(String(setVariable(player, c))));
            player.run = false;
        }

        // Tell
        if (player.Tell) {
            player.tell(String(setVariable(player, player.Tell)));
            player.Tell = false;
        }

        // Kick
        if (player.kick) {
            player.runCommandAsync(`kick "${player.name}" ${setVariable(player, player.kick)}`);
            player.kick = false;
        }

        // Join
        if (player.join) {
            player.setScore("Capi:playerJoinX", Math.floor(player.location.x));
            player.setScore("Capi:playerJoinY", Math.floor(player.location.y));
            player.setScore("Capi:playerJoinZ", Math.floor(player.location.z));
            player.setScore("Capi:joinCount", 1, "add");
            player.addTag("Capi:join");
            player.join = false;
        }

        // Set scoreboard
        // health
        const health = Math.round(player.getComponent("health").current);
        player.setScore("Capi:health", health);

        // pos
        player.setScore("Capi:x", Math.floor(player.location.x));
        player.setScore("Capi:y", Math.floor(player.location.y));
        player.setScore("Capi:z", Math.floor(player.location.z));

        // rotation
        player.setScore("Capi:rx", Math.floor(player.rotation.x));
        player.setScore("Capi:ry", Math.floor(player.rotation.y));

        // selected slot
        player.setScore("Capi:slot", player.selectedSlot);

        // timestamp
        player.setScore("Capi:timestamp", Math.floor( Date.now() / 1000 ));

        // dimension
        if (player.dimension.id === "minecraft:overworld") player.setScore("Capi:dimension", 0);
            else if (player.dimension.id === "minecraft:nether") player.setScore("Capi:dimension", -1);
            else if (player.dimension.id === "minecraft:the_end") player.setScore("Capi:dimension", 1);
            else player.setScore("Capi:dimension", -2);

        if (!player.pushedTime > 0) player.pushedTime = 0;
        if (player.pushedTime >= 1) player.pushedTime++;
        if (player.hasTag(`pushed`) && player.pushedTime == 0) player.pushedTime++;
        if (player.pushedTime > 10){
            // player.getTags().forEach(t => { if(t.startsWith("button:")) player.removeTag(t)});
            const tag = player.getTags().find(t => t.startsWith("button:"));
            if (tag) player.removeTag(tag);
            player.removeTag(`pushed`);
            player.pushedTime = 0;
        }
        
        if (player.hasTag("Capi:open_config_gui")) Menu(player);
    }
});

world.events.entityHit.subscribe(entityHit => {
    const { entity: player, hitEntity: entity, hitBlock: block } = entityHit;
    if (player.typeId !== "minecraft:player") return;
    player.setScore("Capi:attack", 1, "add");
    player.addTag("Capi:attack");
    player.getTags().forEach(t => {if (t.startsWith("attacked:")) player.removeTag(t)});
    if (entity) player.addTag(`attacked:${entity.typeId}`);
        else if (block) player.addTag(`attacked:${block.typeId}`);
});

world.events.entityHurt.subscribe(entityHurt => {
    const { cause, damage, damagingEntity: player, hurtEntity: entity } = entityHurt;
    if (entity && entity.typeId === "minecraft:player") {
        entity.setScore("Capi:hurt", damage);
        entity.getTags().forEach(t => {if (t.startsWith("cause:")) entity.removeTag(t)});
        entity.addTag(`cause:${cause}`);
    }
    if (player && player.typeId === "minecraft:player") {
        player.setScore("Capi:damage", damage);
    }
});

world.events.beforeChat.subscribe(chat => {
    const player = chat.sender;
    let msg = chat.message;
    let mute;
    player.getTags().forEach((t) => {
        t = t.replace(/"/g, "");
        if (t.startsWith("chat:")) player.removeTag(t);
        if (t.startsWith("mute")) mute = t.slice(5);
    });
    player.addTag(`chat:${msg.replace(/"/g, "")}`);
    player.setScore("Capi:chatLength", msg.length);
    player.setScore("Capi:chatCount", 1, "add");
    if (mute || player.hasTag("mute")) {
        player.tell(mute.length ? mute : "§cYou have been muted.");
        return chat.cancel = true;
    }
    if (Config.get("ChatUIEnabled")) {
        chat.sendToTargets = false;
        world.say(setVariable(player, String((Config.get("ChatUI")))).replace("{message}", msg));
    }
});

world.events.itemUse.subscribe(itemUse => {
    const player = itemUse.source;
    const item = itemUse.item;
    const details = {
        id: item.typeId,
        name: item.nameTag,
        amount: item.amount,
        data: item.data,
        lore: item.getLore()
    }
    player.getTags().forEach((t) => {
        if (t.startsWith("itemUse:") || t.startsWith("itemUseD:")) player.removeTag(t);
    });
    player.addTag(`itemUse:${item.typeId}`);
    player.addTag(`itemUseD:${JSON.stringify(details)}`);
});

world.events.blockPlace.subscribe(blockPlace => {
    const { player, block } = blockPlace;
    player.getTags().forEach((t) => {
        if (t.startsWith("blockPlace:")) player.removeTag(t);
    });
    player.addTag(`blockPlace:${block.typeId}`);
    player.setScore("Capi:blockPlaceX", block.location.x);
    player.setScore("Capi:blockPlaceY", block.location.y);
    player.setScore("Capi:blockPlaceZ", block.location.z);
});

// world.events.entityCreate.subscribe(entityCreate => {
//     const entity = entityCreate.entity;

//     const { x, y, z } = entity.location;

//     player.setScore("set", "Capi:EcreateX", Math.floor(x));
//     player.setScore("set", "Capi:EcreateY", Math.floor(y));
//     player.setScore("set", "Capi:EcreateZ", Math.floor(z));

//     const details = {
//         id: entity.id,
//         name: entity.nameTag || entity.id
//     }

//     entity.addTag(`Ecreate:${entity.id}`);
//     entity.addTag(`EcreateD:${JSON.stringify(details)}`);
// });

world.events.effectAdd.subscribe(effectAdd => {
    const player = effectAdd.entity;
    const amplifier = effectAdd.effect.amplifier;
    const duration = effectAdd.effect.duration;
    const displayName = effectAdd.effect.displayName.split(" ")[0];
    if (player.typeId !== "minecraft:player") return;

    player.setScore("Capi:effAddTick", duration);
    player.setScore("Capi:effAddLevel", amplifier);
    player.setScore("Capi:effAddState", effectAdd.effectState);

    const details = {
        effect: displayName,
        level: amplifier,
        tick: duration,
        state: effectAdd.effectState
    }

    player.addTag(`effectAdd:${displayName}`);
    player.addTag(`effectAddD:${JSON.stringify(details)}`);
});

world.events.playerSpawn.subscribe(playerSpawn => {
    const { player, initialSpawn } = playerSpawn;
    if (initialSpawn) player.join = true;
});

world.events.projectileHit.subscribe(projectileHit => {
    const { blockHit, entityHit, projectile, source: player } = projectileHit;

    if(blockHit) {
        const hitBlock = blockHit.block;

        player.setScore("Capi:PhitHbX", Math.floor(hitBlock.location.x));
        player.setScore("Capi:PhitHbY", Math.floor(hitBlock.location.y));
        player.setScore("Capi:PhitHbZ", Math.floor(hitBlock.location.z));

        player.setScore("Capi:PhitPX", Math.floor(player.location.x));
        player.setScore("Capi:PhitPY", Math.floor(player.location.y));
        player.setScore("Capi:PhitPZ", Math.floor(player.location.z));
    }

    if(entityHit) {
        player.setScore("Capi:PhitHeX", Math.floor(entityHit.entity.location.x));
        player.setScore("Capi:PhitHeY", Math.floor(entityHit.entity.location.y));
        player.setScore("Capi:PhitHeZ", Math.floor(entityHit.entity.location.z));
    }

    if(projectile) {
        player.setScore("Capi:PhitEX", Math.floor(projectile.location.x));
        player.setScore("Capi:PhitEY", Math.floor(projectile.location.y));
        player.setScore("Capi:PhitEZ", Math.floor(projectile.location.z));
    }
    
    let details = {}

    if(blockHit) details["hitBlockId"] = blockHit.block.id;
    if(entityHit) details["hitEntityId"] = entityHit.entity.id;
    if(projectile) details["projectileId"] = projectile.id;

    player.addTag(`Phit:${projectile.id}`);
    player.addTag(`PhitD:${JSON.stringify(details)}`);
});

world.events.blockBreak.subscribe(blockBreak => {
    const { player, block, brokenBlockPermutation } = blockBreak;
    player.getTags().forEach((t) => {
        if (t.startsWith("blockBreak:")) player.removeTag(t);
    });
    player.addTag(`blockBreak:${brokenBlockPermutation.type.id}`);
    player.setScore("Capi:blockBreakX", block.x);
    player.setScore("Capi:blockBreakY", block.y);
    player.setScore("Capi:blockBreakZ", block.z);
});

world.events.playerLeave.subscribe(playerLeave => {
    const player = playerLeave.playerName;
    if (Config.get("LeaveMsgEnabled")) world.say(String((Config.get("LeaveMsg")).replace("{name}", player)));
});

world.events.buttonPush.subscribe(buttonPush => {
    const { block, dimension, source: player } = buttonPush;
    let { x, y, z } = block;
    const ButtonCode = Math.ceil(x * y * z);
    try {
        player.runCommandAsync(`tellraw @a[tag=buttonTracker] {"rawtext":[{"text":"[CAPI] pushed the button. §7(Player: ${player.name} , Pos: ${block.x} ${block.y} ${block.z} , Code: ${ButtonCode})"}]}`);
    } catch {}
    player.setScore("Capi:buttonXPos", block.x);
    player.setScore("Capi:buttonYPos", block.y);
    player.setScore("Capi:buttonZPos", block.z);
    player.addTag(`pushed`);
    player.addTag(`button:${ButtonCode}`);
});