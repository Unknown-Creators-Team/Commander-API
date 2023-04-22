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
import { easySafeParse, parsePos, safeParse, setVariable } from "./util.js";
import Config from "./config.js";
import { Menu } from "./ui.js";

const world = Minecraft.world;
const system = Minecraft.system;

tickEvent.subscribe("main", async ({currentTick, deltaTime, tps}) => { try {
    // world.sendMessage("a")
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
                player.setItemJson.push(t.replace("setItem:", ""));
                player.removeTag(t);
            }
            if (t.startsWith("form:")) {
                try { player.formJson = t.replace("form:",""); } catch {}
                player.removeTag(t);
            }
            if (t.startsWith("run:")) {
                if (!player.run) player.run = [];
                player.run.push(t.replace("run:","").replace(/'/g, "\""));
                player.removeTag(t);
            }
            if (t.startsWith("tell:")) {
                player.tell = t.replace("tell:","").replace(/'/g, "\"");
                player.removeTag(t);
            }
            if (t.startsWith("kick:")) {
                player.kick = t.replace("kick:","").replace(/'/g, "\"");
                player.removeTag(t);
            }
            if (t === "kill") {
                player.kill();
                player.removeTag(t);
            }
        });

        // player.setScore = (type, object, score) => player.runCommandAsync(`scoreboard players ${type} @s ${object} ${score ? score : ""}`);

        if (player.isOp()) player.addTag("Capi:hasOp");
            else player.removeTag("Capi:hasOp");

        player.setScore = (object, score = 0, type = "set") => {
            if (type === "set") {
                try { world.scoreboard.setScore(object, player.scoreboard, score); } catch {
                    player.runCommandAsync(`scoreboard players set @s ${object} ${score}`);
                };
            } else if (type === "reset") {
                player.runCommandAsync(`scoreboard players reset @s "${object}"`);
            } else {
                player.runCommandAsync(`scoreboard players ${type} @s ${object} ${score}`);
            }
        }

        // sneaking
        if (player.isSneaking) player.addTag("Capi:sneaking");
        else player.removeTag("Capi:sneaking");

        // tshoot
        if (player.hasTag("Capi:system_tshoot")) {
            player.getTags().forEach((t) => player.removeTag(t));
        }

        // Rename
        if (player.rename) {
            player.nameTag = await setVariable(player, player.rename);
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
            if (setSlot >= 0) {
                player.selectedSlot = setSlot;
                player.setScore("Capi:setSlot", 0, "reset");
            }
        } catch { }

        // Set item

        
        const container = player.getComponent('inventory').container;
        if (player.setItemJson) player.setItemJson.forEach(async setItemJson => {
            
            
            try {
                const Data = await easySafeParse(setItemJson);
                if (!Data.item) return;
                const amount = Data.amount ? Number(Data.amount) : 1;
                const slot = Data.slot ? Number(Data.slot) : false;
                const itemName = Data.item.replace("minecraft:", "");
                const item = new Minecraft.ItemStack(Minecraft.ItemTypes.get(itemName), amount);
                if (Data.name) item.nameTag = await setVariable(player, Data.name);
                if (Data.lore) {
                    for (let v in Data.lore) Data.lore[v] = await setVariable(player, Data.lore[v]);
                    item.setLore(Data.lore);
                }
                if (Data.enchants) {
                    /** @type { Minecraft.EnchantmentList } */
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
                if (Data.can_place_on) item.setCanPlaceOn(Data.can_place_on);
                if (Data.can_destroy) item.setCanDestroy(Data.can_destroy);
                if (Data.lock) item.lockMode = Minecraft.ItemLockMode[Data.lock];
                if (Data.keep_on_death) item.keepOnDeath = Boolean(Data.keep_on_death);
                if (typeof slot == "number") container.setItem(slot, item);
                    else container.addItem(item);
            } catch (e) {
                console.error(e, e.stack);
                player.sendMessage(`§c${e}`);
                for (const ply of world.getPlayers({tags: ["Capi:hasOp"]})) ply.sendMessage(`§c${e}`);
            }
            
        });
        player.setItemJson = [];

        // Show form
        if (player.formJson) {
            const Data = await easySafeParse(player.formJson).catch((error) => {
                console.error(error, error.stack);
                player.sendMessage(`§c${error}`);
                for (const ply of world.getPlayers({tags: ["Capi:hasOp"]})) ply.sendMessage(`§c${error}`);
            }).finally(() => player.formJson = false);
            const Form = new MinecraftUI.ActionFormData();
            if (Data.title) Form.title(String(await setVariable(player, Data.title)));
            if (Data.body) Form.body(String(await setVariable(player, Data.body)));

            Data.buttons.forEach(async (b, index) => {
                if (!b.text) throw TypeError(`The button text is not passed.`);
                const text = await setVariable(player, b.text);
                if (b.textures) Form.button(text, String(b.textures));
                    else Form.button(text);

                if (text && Data.buttons.length - 1 === index) {
                    const response = await Form.show(player);
                    if (Data.buttons[response.selection]?.tag) player.addTag((Data.buttons[response.selection].tag));
                }
            });
            
            
        }

        // Run command
        if (player.run) {
            player.run.forEach(async commands => {
                const Data = await safeParse(commands).catch((error) => {
                    console.error(error, error.stack);
                    player.sendMessage(`§c${error}`);
                    for (const ply of world.getPlayers({tags: ["Capi:hasOp"]})) ply.sendMessage(`§c${error}`);
                });
                if (typeof(Data) === "object" && Data.length) Data.forEach(async c => {
                    // player.sendMessage(`CMD: ${String(await setVariable(player, c))}`);
                    player.runCommandAsync(String(await setVariable(player, c)))
                        // .then((v) => {
                        //     player.sendMessage(`コマンドの実行に成功しました: ${v.successCount}`)
                        // })
                        // .catch((reason) => player.sendMessage(`ERROR: ${reason}`))
                    
                });
            });
        }
        player.run = [];

        // tell
        if (player.tell) {
            player.sendMessage(String(await setVariable(player, player.tell)));
            player.tell = false;
        }

        // Kick
        if (player.kick) {
            player.runCommandAsync(`kick "${player.name}" ${await setVariable(player, player.kick)}`)
            .catch((e) => world.sendMessage(`[${player.name}] §c${e}`));
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
        player.setScore("Capi:rx", Math.floor(player.getRotation().x));
        player.setScore("Capi:ry", Math.floor(player.getRotation().y));

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
        if (player.pushedTime > 10) {
            // player.getTags().forEach(t => { if(t.startsWith("button:")) player.removeTag(t)});
            const tag = player.getTags().find(t => t.startsWith("button:"));
            if (tag) player.removeTag(tag);
            player.removeTag(`pushed`);
            player.pushedTime = 0;
        }

        if (player.hasTag("Capi:open_config_gui")) Menu(player);
    }
} catch (e) {
    console.error(e, e.stack)
}});

world.events.entityHit.subscribe(async entityHit => {
    const { entity: player, hitEntity: entity, hitBlock: block } = entityHit;
    if (player.typeId !== "minecraft:player") return;
    player.setScore("Capi:attacks", 1, "add");
    player.addTag("Capi:attack");
    player.getTags().forEach(t => { if (t.startsWith("attacked:")) player.removeTag(t) });
    if (entity) player.addTag(`attacked:${entity.typeId}`);
    else if (block) player.addTag(`attacked:${block.typeId}`);
});

world.events.entityHurt.subscribe(async entityHurt => {
    const { damage, damageSource, hurtEntity: entity } = entityHurt;
    const { cause, damagingEntity: player } = damageSource;
    
    if (entity && entity.typeId === "minecraft:player") {
        const health = entity.getComponent("health").current;
        if (health <= 0) entity.setScore("Capi:death", 1, "add");
        entity.setScore("Capi:hurt", damage);
        entity.getTags().forEach(t => {if (t.startsWith("cause:")) entity.removeTag(t)});
        entity.addTag(`cause:${cause}`);
        entity.addTag(`Capi:hurt`);
    }
    if (player && player.typeId === "minecraft:player") {
        player.setScore("Capi:damage", damage);
        player.addTag(`Capi:damage`);
        if (entity && entity.getComponent("health").current <= 0)
            player.setScore("Capi:kill", 1, "add");
    }

    if (player && entity && player.typeId === "minecraft:player" && entity.typeId === "minecraft:player") {
        const health = entity.getComponent("health").current;
        if (health <= 0) {
            player.setScore("Capi:killPlayer", 1, "add");
            entity.setScore("Capi:deathPlayer", 1, "add");
        }
    }
});

world.events.beforeChat.subscribe(async chat => {
    const player = chat.sender;
    let msg = chat.message;
    let mute;
    player.getTags().forEach((t) => {
        t = t.replace(/"/g, "");
        if (t.startsWith("chat:")) player.removeTag(t);
        if (t.startsWith("mute")) mute = t.slice(5);
    });
    player.addTag(`Capi:chat`);
    player.addTag(`chat:${msg.replace(/"/g, "")}`);
    player.setScore("Capi:chatLength", msg.length);
    player.setScore("Capi:chatCount", 1, "add");
    if (mute || player.hasTag("mute")) {
        player.sendMessage(mute.length ? mute : "§cYou have been muted.");
        return chat.cancel = true;
    }
    if (Config.get("ChatUIEnabled")) {
        chat.sendToTargets = true;
        world.sendMessage(await setVariable(player, String((Config.get("ChatUI")))).replace("{message}", msg));
    }
});

world.events.itemUse.subscribe(async itemUse => {
    const player = itemUse.source;
    const item = itemUse.item;
    const details = {
        id: item.typeId,
        name: item.nameTag,
        lore: item.getLore()
    }
    player.getTags().forEach((t) => {
        if (t.startsWith("itemUse:") || t.startsWith("itemUseD:")) player.removeTag(t);
    });
    player.addTag(`Capi:itemUse`);
    player.addTag(`itemUse:${item.typeId}`);
    player.addTag(`itemUseD:${JSON.stringify(details).replace(/(\")/g, "`")}`);
});

world.events.itemUseOn.subscribe(async itemUseOn => {
    const { source: player, item, getBlockLocation } = itemUseOn;
    // FIXME: getBlockLocation don't working. This bug will be fixed in 1.19.80.
    // const block = player.dimension.getBlock(getBlockLocation());

    const block = player.getBlockFromViewDirection({maxDistance: 7});

    if (!block instanceof Minecraft.Block || !block?.location) return; 
    
    player.setScore("Capi:itemUseOnX", block.location.x);
    player.setScore("Capi:itemUseOnY", block.location.y);
    player.setScore("Capi:itemUseOnZ", block.location.z);

    player.getTags().forEach((t) => {
        if (t.startsWith("itemUseOn:")) player.removeTag(t);
    });
    player.addTag(`Capi:itemUseOn`);
    player.addTag(`itemUseOn:${block.typeId}`);
})

world.events.blockPlace.subscribe(async blockPlace => {
    const { player, block } = blockPlace;
    player.getTags().forEach((t) => {
        if (t.startsWith("blockPlace:")) player.removeTag(t);
    });
    player.addTag(`Capi:blockPlace`);
    player.addTag(`blockPlace:${block.typeId}`);
    player.setScore("Capi:blockPlaceX", block.location.x);
    player.setScore("Capi:blockPlaceY", block.location.y);
    player.setScore("Capi:blockPlaceZ", block.location.z);
});

// world.events.entityCreate.subscribe(entityCreate => {
//     const entity = entityCreate.entity;

//     const { x, y, z } = entity.location;

//     player.setScore("Capi:EcreateX", Math.floor(x));
//     player.setScore("Capi:EcreateY", Math.floor(y));
//     player.setScore("Capi:EcreateZ", Math.floor(z));

//     const details = {
//         id: entity.id,
//         name: entity.nameTag || entity.id
//     }

//     entity.addTag(`Ecreate:${entity.id}`);
//     entity.addTag(`EcreateD:${JSON.stringify(details)}`);
// });

// world.events.effectAdd.subscribe(effectAdd => {
//     const player = effectAdd.entity;
//     const amplifier = effectAdd.effect.amplifier;
//     const duration = effectAdd.effect.duration;
//     const displayName = effectAdd.effect.displayName.split(" ")[0];
//     if (player.typeId !== "minecraft:player") return;

//     player.setScore("Capi:effAddTick", duration);
//     player.setScore("Capi:effAddLevel", amplifier);
//     player.setScore("Capi:effAddState", effectAdd.effectState);

//     const details = {
//         effect: displayName,
//         level: amplifier,
//         tick: duration,
//         state: effectAdd.effectState
//     }

//     player.addTag(`effectAdd:${displayName}`);
//     player.addTag(`effectAddD:${JSON.stringify(details)}`);
// });

world.events.playerSpawn.subscribe(async playerSpawn => {
    const { player, initialSpawn } = playerSpawn;
    if (initialSpawn) player.join = true;
});

world.events.projectileHit.subscribe(projectileHit => {
    const { getBlockHit, getEntityHit, projectile, source: player } = projectileHit;
    if (player.typeId !== "minecraft:player") return;

    const hit = projectileHit.getBlockHit()?.block || projectileHit.getEntityHit()?.entity;

    if(hit) {
        player.setScore("Capi:hitX", Math.floor(hit.location.x));
        player.setScore("Capi:hitY", Math.floor(hit.location.y));
        player.setScore("Capi:hitZ", Math.floor(hit.location.z));
    }

    player.getTags().forEach((t) => {
        if (t.startsWith("hitWith:") || t.startsWith("hitTo:")) player.removeTag(t);
    });
    player.addTag(`Capi:hit`);
    player.addTag(`hitWith:${projectile.typeId}`);
    player.addTag(`hitTo:${hit.typeId}`);
});

world.events.blockBreak.subscribe(async blockBreak => {
    const { player, block, brokenBlockPermutation } = blockBreak;
    player.getTags().forEach((t) => {
        if (t.startsWith("blockBreak:")) player.removeTag(t);
    });
    player.addTag(`Capi:blockBreak`);
    player.addTag(`blockBreak:${brokenBlockPermutation.type.id}`);
    player.setScore("Capi:blockBreakX", block.x);
    player.setScore("Capi:blockBreakY", block.y);
    player.setScore("Capi:blockBreakZ", block.z);
});

world.events.playerLeave.subscribe(async playerLeave => {
    const player = playerLeave.playerName;
    if (Config.get("LeaveMsgEnabled")) world.sendMessage(String((Config.get("LeaveMsg")).replace("{name}", player)));
});

world.events.buttonPush.subscribe(async buttonPush => {
    const { block, dimension, source: player } = buttonPush;
    const { x, y, z } = block;
    player.setScore("Capi:buttonXPos", x);
    player.setScore("Capi:buttonYPos", y);
    player.setScore("Capi:buttonZPos", z);
    player.addTag(`pushed`);
});

system.events.scriptEventReceive.subscribe(async scriptEventReceive => {
    const { id, initiator, message, sourceBlock, sourceEntity, sourceType } = scriptEventReceive;
    const type = id.split(":")[1];
    const player = sourceBlock || sourceEntity;
    
    if (type.toLowerCase() === "explosion") {
        const msg = message.split(" "), radius = Number(await setVariable(player, msg[0])) || 3, x = parsePos(await setVariable(player, msg[1]), player, "x"), y = parsePos(await setVariable(player, msg[2]), player, "y"), z = parsePos(await setVariable(player, msg[3]), player, "z");
        const loc = {x: x, y: y, z: z};
        const options = {
            allowUnderwater: msg[4] === "true" ? true : false, 
            breaksBlocks: msg[5] === "true" ? true : false,
            causesFire: msg[6] === "true" ? true : false 
        }
        
        player.dimension.createExplosion(loc, radius, options);
    } else if (type.toLowerCase() === "spawnentity") {
        const msg = message.split(" "), id = msg[0], x = parsePos(msg[1], player, "x"), y = parsePos(msg[2], player, "y"), z = parsePos(msg[3], player, "z"), name = msg[4];
        const loc = {x: x, y: y, z: z}, fire = Number(msg[5]);
        if (!id) {
            console.error(TypeError("Invalid entity ID."));
            player?.sendMessage(`§c${TypeError("Invalid entity ID.")}`);
            for (const ply of world.getPlayers({tags: ["Capi:hasOp"]})) ply.sendMessage(`§c${TypeError("Invalid entity ID.")}`);
        }
        
        const entity = player.dimension.spawnEntity(id, loc);
        if (name) entity.nameTag = name;
        if (fire) entity.setOnFire(fire);
    } else if (type.toLowerCase() === "spawnitem") {
        const msg = message.split(" "), id = msg[0], amount = Number(msg[1]) || 1, x = parsePos(msg[2], player, "x"), y = parsePos(msg[3], player, "y"), z = parsePos(msg[4], player, "z"), name = msg[5];
        const loc = {x: x, y: y, z: z};
        if (!id) {
            console.error(TypeError("Invalid item ID."));
            player?.sendMessage(`§c${TypeError("Invalid item ID.")}`);
            for (const ply of world.getPlayers({tags: ["Capi:hasOp"]})) ply.sendMessage(`§c${TypeError("Invalid item ID.")}`);
        }
        
        const item = new Minecraft.ItemStack(Minecraft.ItemTypes.get(id), amount);
        if (name) item.nameTag = name;
        
        player.dimension.spawnItem(item, loc);
    } else if (type.toLowerCase() === "spawnparticle") {
        const msg = message.split(" "), id = msg[0], x = parsePos(msg[1], player, "x"), y = parsePos(msg[2], player, "y"), z = parsePos(msg[3], player, "z"), r = Number(msg[4]) || 1, g = Number(msg[5]) || 1, b = Number(msg[6]) || 1, variable = msg[7];
        const loc = {x: x, y: y, z: z};
        if (!id) {
            console.error(TypeError("Invalid particle ID."));
            player?.sendMessage(`§c${TypeError("Invalid particle ID.")}`);
            for (const ply of world.getPlayers({tags: ["Capi:hasOp"]})) ply.sendMessage(`§c${TypeError("Invalid particle ID.")}`);
        }
                
        player.dimension.spawnParticle(id, loc, new Minecraft.MolangVariableMap().setColorRGB(`variable.${variable}`, new Minecraft.Color(r, g, b, 1)));

    } else if (type.toLowerCase() === "say") {
        if (player instanceof Minecraft.Player) world.sendMessage(await setVariable(player, message));
            else world.sendMessage(await setVariable({}, message));
    } else if (["teleport","tp"].includes(type.toLowerCase()) && player instanceof Minecraft.Player) {
        const msg = message.split(" "), x = parsePos(msg[0], player, "x"), y = parsePos(msg[1], player, "y"), z = parsePos(msg[2], player, "z")
        const rx = parsePos(msg[3], player, "rx"), ry = parsePos(msg[4], player, "ry"), toDimension = msg[5] || player.dimension.id;

        player.teleport({x, y, z}, world.getDimension(toDimension), rx, ry);
    }
    
}, { namespaces: ["Capi"] });