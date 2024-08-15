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

import "./NativeCode.js";
import "./lib/Logger.js";

import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";
// import * as MinecraftVanilla from "@minecraft/vanilla-data";
import tickEvent from "./lib/TickEvent.js";
import { ScoreboardDatabase } from "./lib/DatabaseMC.js";
import { easySafeParse, parsePos, safeParse, setVariable, getScore } from "./util.js";
import Config from "./config.js";
import ESON from "./lib/ESON.js";
import loadEvents from "./events/index.js";
import { UI } from "./ui.js";
import "./scriptevents/index.js";
import "./playground";

import "./checks/checkLoader";

const { world, system } = Minecraft;

system.beforeEvents.watchdogTerminate.subscribe((beforeWatchdogTerminate) => (beforeWatchdogTerminate.cancel = true));

loadEvents();

tickEvent.subscribe("main", ({ currentTick, deltaTime, tps }) => {
    try {
        for (const player of world.getAllPlayers()) {
            if (!player.isValid()) return;

            player.getTags().forEach((t) => {
                if (t.startsWith("rename:")) {
                    const rename = t.replace("rename:", "");
                    player.runCommandAsync(`scriptevent CApi:rename ${rename}`);
                    player.removeTag(t);
                }
                if (t.startsWith("resetName")) {
                    player.runCommandAsync(`scriptevent CApi:resetName`);
                    player.removeTag(t);
                }
                if (t.startsWith("setItem:")) {
                    const setItemJson = t.replace("setItem:", "");
                    player.runCommandAsync(`scriptevent CApi:setItem ${setItemJson}`);
                    player.removeTag(t);
                }
                if (t.startsWith("_form:")) {
                    try {
                        player.formJson = t.replace("form:", "");
                    } catch {}
                    player.removeTag(t);
                }
                if (t.startsWith("run:")) {
                    if (!player.run) player.run = [];
                    player.run.push(t.replace("run:", "").replace(/'/g, '"'));
                    player.removeTag(t);
                }
                if (t.startsWith("tell:")) {
                    player.tell = t.replace("tell:", "").replace(/'/g, '"');
                    player.removeTag(t);
                }
                if (t.startsWith("kick:")) {
                    player.kick = t.replace("kick:", "").replace(/'/g, '"');
                    player.removeTag(t);
                }
                if (t.startsWith("knockback:")) {
                    player.knockback = t.replace("knockback:", "").replace(/'/g, '"');
                    player.removeTag(t);
                }
                if (t.startsWith("kill:")) {
                    player.kill();
                    player.removeTag(t);
                }
            });

            // tshoot
            if (player.hasTag("Capi:system_tshoot")) {
                player.getTags().forEach((t) => player.removeTag(t));
            }

            // Rename
            if (player.rename) {
                player.nameTag = setVariable(player, player.rename) ?? player.rename;
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
                if (setSlot && setSlot >= 0) {
                    player.selectedSlotIndex = setSlot;
                    player.score.reset("Capi:setSlot");
                }
            } catch {}

            // Set item
            const container = player.getComponent("inventory")?.container;
            if (player.setItemJson)
                player.setItemJson.forEach((setItemJson: any) => {
                    try {
                        const Data = easySafeParse(setItemJson);
                        if (!Data.item) return;
                        const amount = Data.amount ? Number(Data.amount) : 1;
                        const slot = Data.slot ? Number(Data.slot) : false;
                        const itemName = Data.item; //.replace("minecraft:", "");
                        const item = new Minecraft.ItemStack(itemName, amount);
                        if (Data.name) item.nameTag = setVariable(player, Data.name);
                        if (Data.lore) {
                            for (let v in Data.lore) Data.lore[v] = setVariable(player, Data.lore[v]);
                            item.setLore(Data.lore);
                        }
                        if (Data.enchants) {
                            const enchantments = item.getComponent("enchantable");
                            for (let i = 0; i < Data.enchants.length; i++) {
                                if (!Data.enchants[i].name) return;
                                let enchantsName = Data.enchants[i].name;
                                let enchantsLevel = 1;
                                if (Data.enchants[i].level) enchantsLevel = Number(Data.enchants[i].level);
                                enchantments?.addEnchantment({ type: enchantsName, level: enchantsLevel });
                            }
                        }
                        if (Data.can_place_on) item.setCanPlaceOn(Data.can_place_on);
                        if (Data.can_destroy) item.setCanDestroy(Data.can_destroy);
                        if (Data.lock) item.lockMode = Minecraft.ItemLockMode[Data.lock as keyof typeof Minecraft.ItemLockMode];
                        if (Data.keep_on_death) item.keepOnDeath = Data.keep_on_death === "true" ? true : false;
                        if (typeof slot == "number") container?.setItem(slot, item);
                        else container?.addItem(item);
                    } catch (e) {
                        console.error(e, (e as any).stack);
                        player.sendMessage(`§c${e}`);
                        for (const ply of world.getPlayers({ tags: ["Capi:hasOp"] })) ply.sendMessage(`§c${e}`);
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

                Data.buttons.forEach((b: any, index: number) => {
                    if (!b.text) throw TypeError(`The button text is not passed.`);
                    const text = setVariable(player, b.text) ?? b.text;
                    if (b.textures) Form.button(text, String(b.textures));
                    else Form.button(text);

                    if (text && Data.buttons.length - 1 === index) {
                        Form.show(player).then((response) => {
                            if (Data.buttons[response.selection as any]?.tag) player.addTagWillRemove(Data.buttons[response.selection as any].tag);
                        });
                    }
                });
            }

            // Run command
            if (player.run) {
                player.run.forEach((commands: string) => {
                    const Data = safeParse<string[]>(commands);
                    if (typeof Data === "object" && Data.length)
                        Data.forEach((c) => {
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
                player
                    .runCommandAsync(`kick "${player.name}" ${setVariable(player, player.kick)}`)
                    .catch((e) => world.sendMessage(`[${player.name}] §c${e}`));
                player.kick = false;
            }

            // Knockback
            if (player.knockback) {
                try {
                    const Data = safeParse<
                        | string[]
                        | {
                              directionX: any;
                              directionZ: any;
                              horizontalStrength: any;
                              verticalStrength: any;
                          }
                    >(player.knockback);

                    const directionX = String(setVariable(player, "directionX" in Data ? Data.directionX : Data[0] || 0));
                    const directionZ = String(setVariable(player, "directionZ" in Data ? Data.directionX : Data[0] || 0));
                    const horizontalStrength = String(setVariable(player, "horizontalStrength" in Data ? Data.directionX : Data[0] || 0));
                    const verticalStrength = String(setVariable(player, "verticalStrength" in Data ? Data.directionX : Data[0] || 0));

                    player.applyKnockback(
                        Number(directionX.search(/[^0-9-.]/) >= 0 ? 0 : directionX),
                        Number(directionZ.search(/[^0-9-.]/) >= 0 ? 0 : directionZ),
                        Number(horizontalStrength.search(/[^0-9-.]/) >= 0 ? 0 : horizontalStrength),
                        Number(verticalStrength.search(/[^0-9-.]/) >= 0 ? 0 : verticalStrength)
                    );

                    player.knockback = false;
                } catch (e) {
                    console.error(e, (e as Error).stack);
                }
            }

            // Join
            if (player.join) {
                player.score.set("Capi:playerJoinX", Math.floor(player.location.x));
                player.score.set("Capi:playerJoinY", Math.floor(player.location.y));
                player.score.set("Capi:playerJoinZ", Math.floor(player.location.z));
                player.score.add("Capi:joinCount", 1);
                player.addTagWillRemove("Capi:join");
                player.join = false;
            }

            if (player.hasTag("Capi:open_config_gui")) {
                const ui = new UI(player);
                ui.Menu();
            }
        }
    } catch (e) {
        console.error(e, (e as Error).stack);
    }
});

system.afterEvents.scriptEventReceive.subscribe(
    (scriptEventReceive) => {
        const { id, initiator, message, sourceBlock, sourceEntity, sourceType } = scriptEventReceive;
        const type = id.split(":")[1];
        const player = sourceBlock || sourceEntity;
        if (!player) throw new Error("The player is not found.");
        if (type.toLowerCase() === "explosion") {
            // try {
            //     const object = easySafeParse(message);
            //     if (!object.radius) return;
            //     const radius = Number(object.radius);
            //     const options = {
            //         allowUnderwater: object.options?.allow_under_water === "true" ? true : false,
            //         breaksBlocks: object.options?.breaks_blocks === "true" ? true : false,
            //         causesFire: object.options?.causes_fire === "true" ? true : false,
            //     };
            //     const x = parsePos(object.x, player, "x");
            //     const y = parsePos(object.y, player, "y");
            //     const z = parsePos(object.z, player, "z");
            //     const loc = { x: x, y: y, z: z };

            //     player.dimension.createExplosion(loc, radius, options);
            // } catch (e) {
            //     console.error(e, (e as Error).stack);
            // }
        } else if (["spawn", "entity"].every((v) => type.toLowerCase().includes(v))) {
            // const object = easySafeParse(message);
            // if (!object.id) return;
            // const id = object.id;

            // const name = object.name;
            // const fire = Number(object.set_on_fire);

            // const x = parsePos(object.x, player, "x");
            // const y = parsePos(object.y, player, "y");
            // const z = parsePos(object.z, player, "z");
            // const loc = { x: x, y: y, z: z };

            // const entity = player.dimension.spawnEntity(id, loc);
            // if (name) entity.nameTag = name;
            // if (fire) entity.setOnFire(fire);
        } else if (["spawn", "item"].every((v) => type.toLowerCase().includes(v))) {
            // const object = easySafeParse(message);
            // if (!object.item) return;
            // const amount = object.amount ? Number(object.amount) : 1;
            // const itemName = object.item; //.replace("minecraft:", "");
            // const item = new Minecraft.ItemStack(itemName, amount);
            // if (object.name) item.nameTag = setVariable(player, object.name);
            // if (object.lore) {
            //     for (let v in object.lore) object.lore[v] = setVariable(player, object.lore[v]);
            //     item.setLore(object.lore);
            // }
            // if (object.enchants) {
            //     const enchantments = item.getComponent("enchantable");
            //     for (let i = 0; i < object.enchants.length; i++) {
            //         if (!object.enchants[i].name) return;
            //         let enchantsName = object.enchants[i].name;
            //         let enchantsLevel = 1;
            //         if (object.enchants[i].level) enchantsLevel = Number(object.enchants[i].level);
            //         enchantments?.addEnchantment({ type: enchantsName, level: enchantsLevel });
            //     }
            // }
            // if (object.can_place_on) item.setCanPlaceOn(object.can_place_on);
            // if (object.can_destroy) item.setCanDestroy(object.can_destroy);
            // if (object.lock) item.lockMode = Minecraft.ItemLockMode[object.lock as keyof typeof Minecraft.ItemLockMode];
            // if (object.keep_on_death) item.keepOnDeath = object.keep_on_death === "true" ? true : false;
            // const x = parsePos(object.x, player, "x");
            // const y = parsePos(object.y, player, "y");
            // const z = parsePos(object.z, player, "z");
            // const loc = { x: x, y: y, z: z };
            // player.dimension.spawnItem(item, loc);
        } else if (type.toLowerCase() === "say") {
            if (player.isPlayer()) world.sendMessage(setVariable(player, message) ?? "");
            else world.sendMessage(setVariable(undefined, message) ?? "");
        } else if (["teleport", "tp"].includes(type.toLowerCase()) && player instanceof Minecraft.Player) {
            const object = easySafeParse(message);

            const x = parsePos(object.x, player, "x");
            const y = parsePos(object.y, player, "y");
            const z = parsePos(object.z, player, "z");
            const rx = parsePos(object.rx, player, "rx");
            const ry = parsePos(object.ry, player, "ry");
            const loc = { x: x, y: y, z: z };

            const dimension = world.getDimension(object.dimension || player.dimension.id);
            player.teleport(loc, { rotation: { x: rx, y: ry }, dimension: dimension });
        }
    },
    { namespaces: ["Capi"] }
);
