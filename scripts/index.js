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

const { world, system } = Minecraft;

// #region Prototype追加 
// 知らないと思うんですけど！この26行目の↓みたいなの押せば閉じれるんですよねこれ！

const DeprecatedWarning = (message) => console.warn(`[Commander-API] Deprecated warning: ${message}`);

Minecraft.Player.prototype.setScore = function(object, score = 0, type = "set") {
    DeprecatedWarning(`Player.setScore is Deprecated.`);

    if (type === "set") {
        try { world.scoreboard.setScore(world.scoreboard.getObjectives().find((v) => v.id === object), this.scoreboardIdentity, score); } catch {
            this.runCommandAsync(`scoreboard players set @s ${object} ${score}`);
        }
    } else if (type === "reset") {
        this.runCommandAsync(`scoreboard players reset @s "${object}"`);
    } else {
        this.runCommandAsync(`scoreboard players ${type} @s ${object} ${score}`);
    }
}

/**
 * 
 * @param {Minecraft.Player} player 
 * @returns { Minecraft.ScoreboardManager }
 */
function createScoreboardManager(player) {
    return {
        set: (objectName, score) => {
            try {
                const objective = world.scoreboard.getObjectives().find((v) => v.id === objectName);
                if (!objective) return undefined;
                world.scoreboard.setScore(objective, player.scoreboardIdentity, score);
            } catch (e) {
                player.runCommandAsync(`scoreboard players set @s "${objectName}" ${score}`);
            }
        },
        reset: (objectName) => {
            player.runCommandAsync(`scoreboard players reset @s "${objectName}"`);
        },
        add: (objectName, score) => {
            try {
                const objective = world.scoreboard.getObjectives().find((v) => v.id === objectName);
                if (!objective) return undefined;
                score += world.scoreboard.getScore(objective, player.scoreboardIdentity);
                world.scoreboard.setScore(objective, player.scoreboardIdentity, score);
            } catch (e) {
                player.runCommandAsync(`scoreboard players add @s "${objectName}" ${score}`);
            }
        },
        remove: (objectName, score) => {
            try {
                const objective = world.scoreboard.getObjectives().find((v) => v.id === objectName);
                if (!objective) return undefined;
                score = world.scoreboard.getScore(objective, player.scoreboardIdentity) - score;
                world.scoreboard.setScore(objective, player.scoreboardIdentity, score);
            } catch (e) {
                player.runCommandAsync(`scoreboard players remove @s "${objectName}" ${score}`);
            }
        },
        get: (objectName) => {
            try {
                const objective = world.scoreboard.getObjectives().find((v) => v.id === objectName);
                if (!objective) return undefined;
                return world.scoreboard.getScore(objective, player.scoreboardIdentity);
            } catch (e) {
                return undefined;
            }
        }
    }
}

function configureNativeFunction () {
    world.getAllPlayers().forEach(player => {
        // @ts-ignore
        if(!player.score) player.score = createScoreboardManager(player);
    });
};

system.run(() => configureNativeFunction());

// Minecraft.Player.prototype.score = {
//     set: (objectName, score) => {
//         try { 
//             world.scoreboard.setScore(world.scoreboard.getObjectives().find((v) => v.id === objectName), this.scoreboardIdentity, score); 
//         } catch (e) {
//             this.runCommandAsync(`scoreboard players set @s ${objectName} ${score}`);
//         }
//     },
//     reset: (objectName) => {},
//     add: (objectName, score) => {},
//     remove: (objectName, score) => {}
// }

// @ts-ignore
Minecraft.Entity.prototype.getTypedComponent = function(componentId) {
    return this.getComponent(componentId);
}

Minecraft.Entity.prototype.isPlayer = function() {
    return this.typeId === Minecraft.MinecraftEntityTypes.player.id || this instanceof Minecraft.Player;
}

// @ts-ignore
Minecraft.ItemStack.prototype.getTypedComponent = function(componentId) {
    return this.getComponent(componentId);
}

// #endregion

tickEvent.subscribe("main", async ({currentTick, deltaTime, tps}) => { try {
    world.getPlayers().forEach(async (player) => {
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

        // player.setScore = (type, object, score) => player.runCommandAsync(`scoreboard players ${type} @s ${object} ${score ? score : ""}`);

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
        const container = player.getTypedComponent('inventory').container;
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
                    const enchantments = item.getTypedComponent("enchantments").enchantments;
                    for (let i = 0; i < Data.enchants.length; i++) {
                        if (!Data.enchants[i].name) return;
                        let enchantsName = Data.enchants[i].name;
                        let enchantsLevel = 1;
                        if (Data.enchants[i].level) enchantsLevel = Number(Data.enchants[i].level);
                        enchantments.addEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantsName], enchantsLevel));
                    }
                    item.getTypedComponent("enchantments").enchantments = enchantments;
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
            const text = await setVariable(player, player.tell);
            player.sendMessage(String(text));
        }
        player.tell = false;

        // Kick
        if (player.kick) {
            player.runCommandAsync(`kick "${player.name}" ${await setVariable(player, player.kick)}`)
            .catch((e) => world.sendMessage(`[${player.name}] §c${e}`));
            player.kick = false;
        }

        // Knockback
        if (player.knockback) { try {
            const Data = await safeParse(player.knockback).catch((error) => {
                console.error(error, error.stack);
                player.sendMessage(`§c${error}`);
                for (const ply of world.getPlayers({tags: ["Capi:hasOp"]})) ply.sendMessage(`§c${error}`);
            });
            
            const directionX = String(await setVariable(player, Data.directionX || Data[0] || 0));
            const directionZ = String(await setVariable(player, Data.directionZ || Data[1] || 0));
            const horizontalStrength = String(await setVariable(player, Data.horizontalStrength || Data[2] || 0));
            const verticalStrength = String(await setVariable(player, Data.verticalStrength || Data[3] || 0));
            player.applyKnockback(
                Number(directionX.search(/[^0-9-.]/) >= 0 ? 0 : directionX),
                Number(directionZ.search(/[^0-9-.]/) >= 0 ? 0 : directionZ),
                Number(horizontalStrength.search(/[^0-9-.]/) >= 0 ? 0 : horizontalStrength),
                Number(verticalStrength.search(/[^0-9-.]/) >= 0 ? 0 : verticalStrength));
            player.knockback = false;
        } catch (e) {console.error(e)}}

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
        // speed
        player.setScore("Capi:speedX", Math.round(player.getVelocity().x * 10));
        player.setScore("Capi:speedY", Math.round(player.getVelocity().y * 10));
        player.setScore("Capi:speedZ", Math.round(player.getVelocity().z * 10));
        player.setScore("Capi:speedXZ", Math.round(Math.sqrt((player.getVelocity().x ** 2) + (player.getVelocity().z ** 2)) * 10));
        player.setScore("Capi:speedXYZ", Math.round(Math.sqrt((player.getVelocity().x ** 2) + (player.getVelocity().y ** 2) + (player.getVelocity().z ** 2)) * 10));

        // vector
        player.setScore("Capi:vectorX", Math.round(player.getViewDirection().x * 100));
        player.setScore("Capi:vectorY", Math.round(player.getViewDirection().y * 100));
        player.setScore("Capi:vectorZ", Math.round(player.getViewDirection().z * 100));
    
        // health
        const health = Math.round(player.getTypedComponent("health").current);
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

        if (player.hasTag("Capi:open_config_gui")) {
            const ui = new UI(player);
            ui.Menu();
        }
    })
} catch (e) {
    console.error(e, e.stack)
}});

world.afterEvents.entityHit.subscribe(async entityHit => {
    const { entity: player, hitEntity: entity, hitBlock: block } = entityHit;
    if (player.typeId !== "minecraft:player") return;
    player.setScore("Capi:attacks", 1, "add");
    player.addTag("Capi:attack");
    player.getTags().forEach(t => { if (t.startsWith("attacked:")) player.removeTag(t) });
    if (entity) player.addTag(`attacked:${entity.typeId}`);
        else if (block) player.addTag(`attacked:${block.typeId}`);
});

world.afterEvents.entityHurt.subscribe(async entityHurt => {
    const { damage, damageSource, hurtEntity: entity } = entityHurt;
    const { cause, damagingEntity: player } = damageSource;
    
    if (entity && entity.typeId === "minecraft:player") {
        entity.setScore("Capi:hurt", damage);
        entity.addTag(`Capi:hurt`);
        entity.getTags().forEach(t => {if (t.startsWith("cause:")) entity.removeTag(t)});
        entity.addTag(`cause:${cause}`);
    }
    if (player && player.typeId === "minecraft:player") {
        player.setScore("Capi:damage", damage);
        player.addTag(`Capi:damage`);
    }
});

world.afterEvents.entityDie.subscribe(entityDie => {
    const { damageSource, deadEntity: entity } = entityDie;
    const { damagingEntity: player, cause } = damageSource;

    if (player && player?.typeId === "minecraft:player") {

        if (entity?.typeId === "minecraft:player") {
            player.setScore("Capi:killPlayer", 1, "add");
            player.addTag("Capi:killPlayer");
            entity.setScore("Capi:deathPlayer", 1, "add");
            entity.addTag("Capi:deathPlayer");
        } else {
            player.setScore("Capi:kill", 1, "add");
            player.addTag("Capi:kill");
        }
    }

    if (entity.typeId === "minecraft:player") {

        if (player?.typeId !== "minecraft:player") {
            entity.setScore("Capi:death", 1, "add");
            entity.addTag("Capi:death");
        }
    }
});

world.beforeEvents.chatSend.subscribe(async chat => {
    const player = chat.sender;

    let msg = chat.message;
    /** @type { false | string } */
    let mute = false;

    player.getTags().forEach((t) => {
        t = t.replace(/"/g, "");
        if (t.startsWith("chat:")) player.removeTag(t);
        if (t.startsWith("mute:")) mute = t.slice(5);
    });
    player.addTag(`Capi:chat`);
    player.addTag(`chat:${msg.replace(/"/g, "")}`);
    player.setScore("Capi:chatLength", msg.length, "settings");
    player.setScore("Capi:chatCount", 1, "add");
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
        const text = await setVariable(player, String((Config.get("ChatUI"))));
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

    player.getTags().forEach((t) => {
        if (t.startsWith("itemUse:") || t.startsWith("itemUseD:")) player.removeTag(t);
    });

    player.addTag(`Capi:itemUse`);
    player.addTag(`itemUse:${item.typeId}`);
    player.addTag(`itemUseD:${ESON.stringify(details)}`);
});

world.afterEvents.itemUseOn.subscribe(async itemUseOn => {
    const { source: player, itemStack: item, block } = itemUseOn;
    
    if(!player.isPlayer()) return;

    player.score.set("Capi:itemUseOnX", block.location.x);
    player.score.set("Capi:itemUseOnY", block.location.y);
    player.score.set("Capi:itemUseOnZ", block.location.z);

    player.getTags().forEach((t) => {
        if (t.startsWith("itemUseOn:")) player.removeTag(t);
    });
    player.addTag(`Capi:itemUseOn`);
    player.addTag(`itemUseOn:${block.typeId}`);
})

world.afterEvents.blockPlace.subscribe(blockPlace => {
    const { player, block } = blockPlace;

    player.getTags().forEach((t) => {
        if (t.startsWith("blockPlace:")) player.removeTag(t);
    });

    player.addTag(`Capi:blockPlace`);
    player.addTag(`blockPlace:${block.typeId}`);
    player.score.set("Capi:blockPlaceX", block.location.x);
    player.score.set("Capi:blockPlaceY", block.location.y);
    player.score.set("Capi:blockPlaceZ", block.location.z);
});

world.afterEvents.playerSpawn.subscribe(async playerSpawn => {
    configureNativeFunction();
    const { player, initialSpawn } = playerSpawn;

    if (initialSpawn) player.join = true;
});

world.afterEvents.projectileHit.subscribe(projectileHit => {
    const { getBlockHit, getEntityHit, projectile, source: player } = projectileHit;
    if (!player.isPlayer()) return;

    const hit = projectileHit.getBlockHit()?.block || projectileHit.getEntityHit()?.entity;

    if (hit) {
        player.score.set("Capi:hitX", Math.floor(hit.location.x));
        player.score.set("Capi:hitY", Math.floor(hit.location.y));
        player.score.set("Capi:hitZ", Math.floor(hit.location.z));
    }

    player.getTags().forEach((t) => {
        if (t.startsWith("hitWith:") || t.startsWith("hitTo:")) player.removeTag(t);
    });

    player.addTag(`Capi:hit`);
    player.addTag(`hitWith:${projectile.typeId}`);
    player.addTag(`hitTo:${hit.typeId}`);
});

world.afterEvents.blockBreak.subscribe(async blockBreak => {
    const { player, block, brokenBlockPermutation } = blockBreak;

    player.getTags().forEach((t) => {
        if (t.startsWith("blockBreak:")) player.removeTag(t);
    });

    player.addTag(`Capi:blockBreak`);
    player.addTag(`blockBreak:${brokenBlockPermutation.type.id}`);
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
    player.addTag(`pushed`);
});

system.events.scriptEventReceive.subscribe(async scriptEventReceive => {
    const { id, initiator, message, sourceBlock, sourceEntity, sourceType } = scriptEventReceive;
    const type = id.split(":")[1];
    const player = sourceBlock || sourceEntity;
    
    if (type.toLowerCase() === "explosion") { try {
        const object = await easySafeParse(message);
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

    } catch(e) {console.error(e)}} else if (["spawn", "entity"].every(v => type.toLowerCase().includes(v))) {

        const object = await easySafeParse(message);
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
        
        const object = await easySafeParse(message);
        if (!object.item) return;
        const amount = object.amount ? Number(object.amount) : 1;
        const itemName = object.item.replace("minecraft:", "");
        const item = new Minecraft.ItemStack(Minecraft.ItemTypes.get(itemName), amount);
        if (object.name) item.nameTag = await setVariable(player, object.name);
        if (object.lore) {
            for (let v in object.lore) object.lore[v] = await setVariable(player, object.lore[v]);
            item.setLore(object.lore);
        }
        if (object.enchants) {
            /** @type { Minecraft.EnchantmentList } */
            const enchantments = item.getTypedComponent("enchantments").enchantments;
            for (let i = 0; i < object.enchants.length; i++) {
                if (!object.enchants[i].name) return;
                let enchantsName = object.enchants[i].name;
                let enchantsLevel = 1;
                if (object.enchants[i].level) enchantsLevel = Number(object.enchants[i].level);
                enchantments.addEnchantment(new Minecraft.Enchantment(Minecraft.MinecraftEnchantmentTypes[enchantsName], enchantsLevel));
            }
            item.getTypedComponent("enchantments").enchantments = enchantments;
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
    } else if (["spawn", "particle"].every(v => type.toLowerCase().includes(v))) {

        const object = await easySafeParse(message);
        if (!object.id) return;
        const id = object.id;

        const x = parsePos(object.x, player, "x");
        const y = parsePos(object.y, player, "y");
        const z = parsePos(object.z, player, "z");
        const loc = {x: x, y: y, z: z};

        const r = Number(object?.color.r);
        const g = Number(object?.color.g);
        const b = Number(object?.color.b);
        const variable = Number(object.variable);
                
        player.dimension.spawnParticle(id, loc, new Minecraft.MolangVariableMap().setColorRGB(`variable.${variable}`, new Minecraft.Color(r, g, b, 1)));

    } else if (type.toLowerCase() === "say") {

        if (player instanceof Minecraft.Player) world.sendMessage(await setVariable(player, message));
            else world.sendMessage(await setVariable({}, message));

    } else if (["teleport","tp"].includes(type.toLowerCase()) && player instanceof Minecraft.Player) {

        const object = await easySafeParse(message);

        const x = parsePos(object.x, player, "x");
        const y = parsePos(object.y, player, "y");
        const z = parsePos(object.z, player, "z");
        const rx = parsePos(object.rx, player, "rx");
        const ry = parsePos(object.ry, player, "ry");
        const loc = {x: x, y: y, z: z};

        const dimension = object.dimension || player.dimension.id;

        player.teleport(loc, world.getDimension(dimension), rx, ry);

    }
}, { namespaces: ["Capi"] });
