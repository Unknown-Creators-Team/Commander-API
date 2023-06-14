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
import Config from "./config.js";

const { world, system } = Minecraft;


/**
 * 
 * @param {Minecraft.Player} player 
 * @returns { Minecraft.ScoreboardManager }
 */
function createScoreboardManager(player) {
    return {
        set: (objectName, score) => {
            // console.warn(objectName, score)
            try {
                const objective = world.scoreboard.getObjective(objectName);
                if (!objective) return undefined;
                world.scoreboard.setScore(objective, player.scoreboardIdentity, score);
            } catch (e) {
                console.warn(e);
                player.runCommandAsync(`scoreboard players set @s "${objectName}" ${score}`);
            }
        },
        reset: (objectName) => {
            player.runCommandAsync(`scoreboard players reset @s "${objectName}"`);
        },
        add: (objectName, score) => {
            try {
                const objective = world.scoreboard.getObjective(objectName);
                if (!objective) return undefined;
                score += world.scoreboard.getScore(objective, player.scoreboardIdentity);
                world.scoreboard.setScore(objective, player.scoreboardIdentity, score);
            } catch (e) {
                player.runCommandAsync(`scoreboard players add @s "${objectName}" ${score}`);
            }
        },
        remove: (objectName, score) => {
            try {
                const objective = world.scoreboard.getObjective(objectName);
                if (!objective) return undefined;
                score = world.scoreboard.getScore(objective, player.scoreboardIdentity) - score;
                world.scoreboard.setScore(objective, player.scoreboardIdentity, score);
            } catch (e) {
                player.runCommandAsync(`scoreboard players remove @s "${objectName}" ${score}`);
            }
        },
        get: (objectName) => {
            try {
                const objective = world.scoreboard.getObjective(objectName);
                if (!objective) return undefined;
                return world.scoreboard.getScore(objective, player.scoreboardIdentity) || undefined;
            } catch (e) {
                return undefined;
            }
        }
    }
}

export function configureNativeFunction () {
    world.getAllPlayers().forEach(player => {
        // @ts-ignore
        if(!player.score) player.score = createScoreboardManager(player);
    });
};

system.runInterval(() => configureNativeFunction());
console.warn("NativeCode.js is loaded.")

// world.afterEvents.playerSpawn.subscribe(() => configureNativeFunction());

// @ts-ignore
Minecraft.Entity.prototype.getTypedComponent = function(componentId) {
    return this.getComponent(componentId);
}

Minecraft.Entity.prototype.isPlayer = function() {
    return this.typeId === Minecraft.MinecraftEntityTypes.player.id || this instanceof Minecraft.Player;
}

Minecraft.Entity.prototype.addTags = function(tags) {
    for(const tag of tags) {
        this.addTag(tag);
    }
}

Minecraft.Entity.prototype.removeTags = function(tags) {
    for(const tag of tags) {
        this.removeTag(tag);
    }
}

Minecraft.Entity.prototype.addTagWillRemove = function(tag) {
    this.addTag(tag);
    system.runTimeout(() => this.removeTag(tag), Config.hasAll("TagWillRemoveTick") ? Config.get("TagWillRemoveTick") : 10);
}

// @ts-ignore
Minecraft.ItemStack.prototype.getTypedComponent = function(componentId) {
    return this.getComponent(componentId);
}