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
import { Database, ExtendedDatabase } from "./lib/Database.js";
import { easySafeParse, parsePos, safeParse, setVariable, getScore } from "./util.js";
import Config from "./config.js";
import ESON from "./lib/ESON.js";
import { UI } from "./ui.js";
import "./NativeCode.js";

const { world, system } = Minecraft;

tickEvent.subscribe("main", ({currentTick, deltaTime, tps}) => { try {
    world.getPlayers().forEach((player) => {
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
            if (t.startsWith("knockback:")) {
                player.knockback = t.replace("knockback:","").replace(/'/g, "\"");
                player.removeTag(t);
            }
            if (t === "kill") {
                player.kill();
                player.removeTag(t);
            }
        });

        // is op
        if (player.isOp()) player.addTag("Capi:hasOp");
            else player.removeTag("Capi:hasOp");

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
            if (setSlot >= 0) {
                player.selectedSlot = setSlot;
                player.score.reset("Capi:setSlot");
            }
        } catch { }

        // Set item
        const container = player.getComponent('inventory').container;
        if (player.setItemJson) player.setItemJson.forEach(setItemJson => {
            try {
                const Data = easySafeParse(setItemJson);
                if (!Data.item) return;
                const amount = Data.amount ? Number(Data.amount) : 1;
                const slot = Data.slot ? Number(Data.slot) : false;
                const itemName = Data.item.replace("minecraft:", "");
                const item = new Minecraft.ItemStack(Minecraft.ItemTypes.get(itemName), amount);
                if (Data.name) item.nameTag = setVariable(player, Data.name);
                if (Data.lore) {
                    for (let v in Data.lore) Data.lore[v] = setVariable(player, Data.lore[v]);
                    item.setLore(Data.lore);
                }
                if (Data.enchants) {
                    /** @type { Minecraft.EnchantmentList } */
                    const enchantments = item.getComponent("enchantments").enchantments;
                    for (let i = 0; i < Data.enchants.length; i++) {
                        if (!Data.enchants[i].name) return;
                        let enchantsName = Data.enchants[i].name;
                        let enchantsLevel = 1;
                        if (Data.enchants[i].level) enchantsLevel = Number(Data.enchants[i].level);
                        enchantments.addEnchantment(new Minecraft.Enchantment(enchantsName, enchantsLevel));
                    }
                    item.getComponent("enchantments").enchantments = enchantments;
                }
                if (Data.can_place_on) item.setCanPlaceOn(Data.can_place_on);
                if (Data.can_destroy) item.setCanDestroy(Data.can_destroy);
                if (Data.lock) item.lockMode = Minecraft.ItemLockMode[Data.lock];
                if (Data.keep_on_death) item.keepOnDeath = Data.keep_on_death === "true" ? true : false;
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
            const Data = easySafeParse(player.formJson);
            player.formJson = false;
            const Form = new MinecraftUI.ActionFormData();
            if (Data.title) Form.title(String(setVariable(player, Data.title)));
            if (Data.body) Form.body(String(setVariable(player, Data.body)));

            Data.buttons.forEach((b, index) => {
                if (!b.text) throw TypeError(`The button text is not passed.`);
                const text = setVariable(player, b.text);
                if (b.textures) Form.button(text, String(b.textures));
                    else Form.button(text);

                if (text && Data.buttons.length - 1 === index) {
                    Form.show(player).then(response => {
                        if (Data.buttons[response.selection]?.tag) player.addTagWillRemove((Data.buttons[response.selection].tag));
                    });
                }
            });
        }

        // Run command
        if (player.run) {
            player.run.forEach(commands => {
                const Data = safeParse(commands);
                if (typeof(Data) === "object" && Data.length) Data.forEach(c => {
                    player.runCommandAsync(String(setVariable(player, c))).catch(() => {});
                    
                });
            });
        }
        player.run = [];
        
        // tell
        if (player.tell) {
            const text = setVariable(player, player.tell);
            player.sendMessage(String(text));
        }
        player.tell = false;

        // Kick
        if (player.kick) {
            player.runCommandAsync(`kick "${player.name}" ${setVariable(player, player.kick)}`)
            .catch((e) => world.sendMessage(`[${player.name}] §c${e}`));
            player.kick = false;
        }

        // Knockback
        if (player.knockback) { try {
            const Data = safeParse(player.knockback);
            
            const directionX = String(setVariable(player, Data.directionX || Data[0] || 0));
            const directionZ = String(setVariable(player, Data.directionZ || Data[1] || 0));
            const horizontalStrength = String(setVariable(player, Data.horizontalStrength || Data[2] || 0));
            const verticalStrength = String(setVariable(player, Data.verticalStrength || Data[3] || 0));
            player.applyKnockback(
                Number(directionX.search(/[^0-9-.]/) >= 0 ? 0 : directionX),
                Number(directionZ.search(/[^0-9-.]/) >= 0 ? 0 : directionZ),
                Number(horizontalStrength.search(/[^0-9-.]/) >= 0 ? 0 : horizontalStrength),
                Number(verticalStrength.search(/[^0-9-.]/) >= 0 ? 0 : verticalStrength));
            player.knockback = false;
        } catch (e) {console.error(e, e.stack)}}

        // Join
        if (player.join) {
            player.score.set("Capi:playerJoinX", Math.floor(player.location.x));
            player.score.set("Capi:playerJoinY", Math.floor(player.location.y));
            player.score.set("Capi:playerJoinZ", Math.floor(player.location.z));
            player.score.add("Capi:joinCount", 1);
            player.addTagWillRemove("Capi:join");
            player.join = false;
        }

        // Set scoreboard
        // speed
        player.score.set("Capi:speedX", Math.round(player.getVelocity().x * 10));
        player.score.set("Capi:speedY", Math.round(player.getVelocity().y * 10));
        player.score.set("Capi:speedZ", Math.round(player.getVelocity().z * 10));
        player.score.set("Capi:speedXZ", Math.round(Math.sqrt((player.getVelocity().x ** 2) + (player.getVelocity().z ** 2)) * 10));
        player.score.set("Capi:speedXYZ", Math.round(Math.sqrt((player.getVelocity().x ** 2) + (player.getVelocity().y ** 2) + (player.getVelocity().z ** 2)) * 10));

        // vector
        player.score.set("Capi:vectorX", Math.round(player.getViewDirection().x * 100));
        player.score.set("Capi:vectorY", Math.round(player.getViewDirection().y * 100));
        player.score.set("Capi:vectorZ", Math.round(player.getViewDirection().z * 100));
    
        // health
        const health = Math.round(player.getComponent("health").current);
        player.score.set("Capi:health", health);

        // pos
        player.score.set("Capi:x", Math.floor(player.location.x));
        player.score.set("Capi:y", Math.floor(player.location.y));
        player.score.set("Capi:z", Math.floor(player.location.z));

        // rotation
        player.score.set("Capi:rx", Math.floor(player.getRotation().x));
        player.score.set("Capi:ry", Math.floor(player.getRotation().y));

        // selected slot
        player.score.set("Capi:slot", player.selectedSlot);

        // timestamp
        player.score.set("Capi:timestamp", Math.floor( Date.now() / 1000 ));

        // dimension
        if (player.dimension.id === "minecraft:overworld") player.score.set("Capi:dimension", 0);
            else if (player.dimension.id === "minecraft:nether") player.score.set("Capi:dimension", -1);
            else if (player.dimension.id === "minecraft:the_end") player.score.set("Capi:dimension", 1);
            else player.score.set("Capi:dimension", -2);

        if (player.hasTag("Capi:open_config_gui")) {
            const ui = new UI(player);
            ui.Menu();
        }
    })
} catch (e) {
    console.error(e, e.stack)
}});

world.afterEvents.entityHit.subscribe(entityHit => {
    const { entity: player, hitEntity: entity, hitBlock: block } = entityHit;

    if (!player.isPlayer()) return;

    player.score.add("Capi:attacks", 1);
    player.addTagWillRemove("Capi:attack");
    player.removeTags(player.getTags().filter(t => t.startsWith("attacked:")));
    if (entity) player.addTagWillRemove(`attacked:${entity.typeId}`);
        else if (block) player.addTagWillRemove(`attacked:${block.typeId}`);
});

world.afterEvents.entityHurt.subscribe(entityHurt => {
    const { damage, damageSource, hurtEntity: entity } = entityHurt;
    const { cause, damagingEntity: player } = damageSource;
    
    if (entity && entity.isPlayer()) {
        entity.score.set("Capi:hurt", damage);
        entity.addTagWillRemove(`Capi:hurt`);
        player.removeTags(player.getTags().filter(t => t.startsWith("cause:")));
        entity.addTagWillRemove(`cause:${cause}`);
    }
    if (player && player.isPlayer()) {
        player.score.set("Capi:damage", damage);
        player.addTagWillRemove(`Capi:damage`);
    }
});

world.afterEvents.entityDie.subscribe(entityDie => {
    const { damageSource, deadEntity: entity } = entityDie;
    const { damagingEntity: player, cause } = damageSource;

    if (player && player.isPlayer()) {

        if (entity && entity.isPlayer()) {
            player.score.add("Capi:killPlayer", 1);
            player.addTagWillRemove("Capi:killPlayer");
            entity.score.add("Capi:deathPlayer", 1);
            entity.addTagWillRemove("Capi:deathPlayer");
        } else {
            player.score.add("Capi:kill", 1);
            player.addTagWillRemove("Capi:kill");
        }
    }

    if (entity.isPlayer()) {
        if (!player.isPlayer()) {
            entity.score.add("Capi:death", 1);
            entity.addTagWillRemove("Capi:death");
        }
    }
});

world.beforeEvents.chatSend.subscribe(chat => {
    const player = chat.sender;

    let msg = chat.message;
    /** @type { string } */
    let mute = false;
    
    player.getTags().forEach((t) => {
        t = t.replace(/"/g, "");
        if (t.startsWith("chat:")) player.removeTag(t);
        if (t.startsWith("mute:")) mute = t.slice(5);
    });
    player.addTagWillRemove(`Capi:chat`);
    player.addTagWillRemove(`chat:${msg.replace(/"/g, "")}`);
    player.score.set("Capi:chatLength", msg.length);
    player.score.add("Capi:chatCount", 1);
    if (Config.get("CancelSendMsgEnabled")) {
        const CancelSendMsg = Config.get("CancelSendMsg");
        const start = CancelSendMsg?.start.some(v => v.length && msg.startsWith(v));
        const end = CancelSendMsg?.end.some(v => v.length && msg.endsWith(v));
        const include = CancelSendMsg?.include.some(v => v.length && msg.includes(v));
        if (start || end || include) return chat.cancel = true;
    }
    if (mute || player.hasTag("mute")) {
        player.sendMessage(mute.length ? mute : "§cYou have been muted.");
        return chat.cancel = true;
    }
    if (Config.get("ChatUIEnabled")) {
        chat.sendToTargets = true;
        const text = setVariable(player, String((Config.get("ChatUI"))));
        world.sendMessage(text.replace("{message}", msg));
    }
});

world.afterEvents.itemUse.subscribe(itemUse => {
    const { source: player, itemStack: item } = itemUse;

    const details = {
        id: item.typeId,
        name: item.nameTag,
        lore: item.getLore()
    }

    player.removeTags(player.getTags().filter(t => t.startsWith("itemUse:") || t.startsWith("itemUseD:")));

    player.addTagWillRemove(`Capi:itemUse`);
    player.addTagWillRemove(`itemUse:${item.typeId}`);
    player.addTagWillRemove(`itemUseD:${ESON.stringify(details)}`);
});

world.afterEvents.itemUseOn.subscribe(async itemUseOn => {
    const { source: player, itemStack: item, block } = itemUseOn;
    
    if(!player.isPlayer()) return;

    player.score.set("Capi:itemUseOnX", block.location.x);
    player.score.set("Capi:itemUseOnY", block.location.y);
    player.score.set("Capi:itemUseOnZ", block.location.z);

    player.removeTags(player.getTags().filter(t => t.startsWith("itemUseOn:")));

    player.addTagWillRemove(`Capi:itemUseOn`);
    player.addTagWillRemove(`itemUseOn:${block.typeId}`);
})

world.afterEvents.blockPlace.subscribe(blockPlace => {
    const { player, block } = blockPlace;

    player.removeTags(player.getTags().filter(t => t.startsWith("blockPlace:")));

    player.addTagWillRemove(`Capi:blockPlace`);
    player.addTagWillRemove(`blockPlace:${block.typeId}`);
    player.score.set("Capi:blockPlaceX", block.location.x);
    player.score.set("Capi:blockPlaceY", block.location.y);
    player.score.set("Capi:blockPlaceZ", block.location.z);
});

world.afterEvents.playerSpawn.subscribe(async playerSpawn => {
    const { player, initialSpawn } = playerSpawn;

    if (initialSpawn) player.join = true;
});

world.afterEvents.projectileHit.subscribe(projectileHit => {
    const { projectile, source: player } = projectileHit;
    if (!player.isPlayer()) return;

    const hit = projectileHit.getBlockHit()?.block || projectileHit.getEntityHit()?.entity;

    if (hit) {
        player.score.set("Capi:hitX", Math.floor(hit.location.x));
        player.score.set("Capi:hitY", Math.floor(hit.location.y));
        player.score.set("Capi:hitZ", Math.floor(hit.location.z));
    }

    player.removeTags(player.getTags().filter(t => t.startsWith("hitWith:") || t.startsWith("hitTo:")));

    player.addTagWillRemove(`Capi:hit`);
    player.addTagWillRemove(`hitWith:${projectile.typeId}`);
    player.addTagWillRemove(`hitTo:${hit.typeId}`);
});

world.afterEvents.blockBreak.subscribe(async blockBreak => {
    const { player, block, brokenBlockPermutation } = blockBreak;

    player.removeTags(player.getTags().filter(t => t.startsWith("blockBreak:")));

    player.addTagWillRemove(`Capi:blockBreak`);
    player.addTagWillRemove(`blockBreak:${brokenBlockPermutation.type.id}`);
    player.score.set("Capi:blockBreakX", block.x);
    player.score.set("Capi:blockBreakY", block.y);
    player.score.set("Capi:blockBreakZ", block.z);
});

world.afterEvents.playerLeave.subscribe(async playerLeave => {
    const player = playerLeave.playerName;
    if (Config.get("LeaveMsgEnabled")) world.sendMessage(String((Config.get("LeaveMsg")).replace("{name}", player)));
});

world.afterEvents.buttonPush.subscribe(async buttonPush => {
    const { block, dimension, source: player } = buttonPush;
    const { x, y, z } = block;

    if(!player.isPlayer()) return;
    
    player.score.set("Capi:buttonXPos", x);
    player.score.set("Capi:buttonYPos", y);
    player.score.set("Capi:buttonZPos", z);
    player.addTagWillRemove(`Capi:pushed`);
});

system.events.scriptEventReceive.subscribe(scriptEventReceive => {
    const { id, initiator, message, sourceBlock, sourceEntity, sourceType } = scriptEventReceive;
    const type = id.split(":")[1];
    const player = sourceBlock || sourceEntity;
    
    if (type.toLowerCase() === "explosion") { try {
        const object = easySafeParse(message);
        if (!object.radius) return;
        const radius = Number(object.radius);
        const options = {
            allowUnderwater: object.options?.allow_under_water === "true" ? true : false,
            breaksBlocks: object.options?.breaks_blocks === "true" ? true : false,
            causesFire: object.options?.causes_fire === "true" ? true : false
        }
        const x = parsePos(object.x, player, "x");
        const y = parsePos(object.y, player, "y");
        const z = parsePos(object.z, player, "z");
        const loc = {x: x, y: y, z: z};
        
        player.dimension.createExplosion(loc, radius, options);

    } catch(e) {console.error(e, e.stack)}} else if (["spawn", "entity"].every(v => type.toLowerCase().includes(v))) {

        const object = easySafeParse(message);
        if (!object.id) return;
        const id = object.id;

        const name = object.name;
        const fire = Number(object.set_on_fire);

        const x = parsePos(object.x, player, "x");
        const y = parsePos(object.y, player, "y");
        const z = parsePos(object.z, player, "z");
        const loc = {x: x, y: y, z: z};
        
        const entity = player.dimension.spawnEntity(id, loc);
        if (name) entity.nameTag = name;
        if (fire) entity.setOnFire(fire);

    } else if (["spawn", "item"].every(v => type.toLowerCase().includes(v))) {
        
        const object = easySafeParse(message);
        if (!object.item) return;
        const amount = object.amount ? Number(object.amount) : 1;
        const itemName = object.item.replace("minecraft:", "");
        const item = new Minecraft.ItemStack(Minecraft.ItemTypes.get(itemName), amount);
        if (object.name) item.nameTag = setVariable(player, object.name);
        if (object.lore) {
            for (let v in object.lore) object.lore[v] = setVariable(player, object.lore[v]);
            item.setLore(object.lore);
        }
        if (object.enchants) {
            /** @type { Minecraft.EnchantmentList } */
            const enchantments = item.getComponent("enchantments").enchantments;
            for (let i = 0; i < object.enchants.length; i++) {
                if (!object.enchants[i].name) return;
                let enchantsName = object.enchants[i].name;
                let enchantsLevel = 1;
                if (object.enchants[i].level) enchantsLevel = Number(object.enchants[i].level);
                enchantments.addEnchantment(new Minecraft.Enchantment(enchantsName, enchantsLevel));
            }
            item.getComponent("enchantments").enchantments = enchantments;
        }
        if (object.can_place_on) item.setCanPlaceOn(object.can_place_on);
        if (object.can_destroy) item.setCanDestroy(object.can_destroy);
        if (object.lock) item.lockMode = Minecraft.ItemLockMode[object.lock];
        if (object.keep_on_death) item.keepOnDeath = object.keep_on_death === "true" ? true : false;
        const x = parsePos(object.x, player, "x");
        const y = parsePos(object.y, player, "y");
        const z = parsePos(object.z, player, "z");
        const loc = {x: x, y: y, z: z};
        player.dimension.spawnItem(item, loc);
    } else if (type.toLowerCase() === "say") {

        if (player instanceof Minecraft.Player) world.sendMessage(setVariable(player, message));
            else world.sendMessage(setVariable({}, message));

    } else if (["teleport","tp"].includes(type.toLowerCase()) && player instanceof Minecraft.Player) {

        const object = easySafeParse(message);

        const x = parsePos(object.x, player, "x");
        const y = parsePos(object.y, player, "y");
        const z = parsePos(object.z, player, "z");
        const rx = parsePos(object.rx, player, "rx");
        const ry = parsePos(object.ry, player, "ry");
        const loc = {x: x, y: y, z: z};

        const dimension = world.getDimension(object.dimension || player.dimension.id);
        player.teleport(loc, {rotation: {x: rx, y: ry}, dimension: dimension});

    }
}, { namespaces: ["Capi"] });
