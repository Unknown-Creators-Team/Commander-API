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
import * as GameTest from "@minecraft/server-gametest";
import Config from "./config.js";

const { world, system } = Minecraft;

Object.assign(Minecraft.Entity.prototype, {
    addTagWillRemove(tag: string) {
        if (!Config.has("TagWillRemoveTick"))
            Config.set("TagWillRemoveTick", 10);
        system.run(() => {
            this.addTag(tag);
            if (!Config.get("TagWillRemoveTickEnabled")) return;
            system.runTimeout(() => this.removeTag(tag), Config.has("TagWillRemoveTick") ? Config.get("TagWillRemoveTick") : 10);
        });
    },
    removeTags(tags: string[]) { tags.forEach(tag => this.removeTag(tag)); },
    addTags(tags: string[]) { tags.forEach(tag => this.addTag(tag)); },
    isPlayer() {
        if (!this.isValid()) return false;
        return this instanceof Minecraft.Player || this instanceof GameTest.SimulatedPlayer;
    },
    isEntity() {
        if (!this.isValid()) return false;
        return this instanceof Minecraft.Entity;
    },
    isBlock() {
        return false;
    }
});

Object.assign(Minecraft.Block.prototype, {
    isPlayer() {
        return false;
    },
    isEntity() {
        return false
    },
    isBlock() {
        return true;
    }
});

function createScoreboardManager(player: Minecraft.Player): Minecraft.ScoreboardManager {
    return {
        set: (objectName, score) => {
            // console.warn(objectName, score)
            try {
                const objective = world.scoreboard.getObjective(objectName);
                if (!objective) return undefined;

                objective.setScore(player.scoreboardIdentity, score);
            } catch (e) {
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

                objective.setScore(player.scoreboardIdentity, score + (objective.getScore(player.scoreboardIdentity) || 0));
            } catch (e) {
                player.runCommandAsync(`scoreboard players add @s "${objectName}" ${score}`);
            }
        },
        remove: (objectName, score) => {
            try {
                const objective = world.scoreboard.getObjective(objectName);
                if (!objective) return undefined;

                score = objective.getScore(player.scoreboardIdentity) - score;

                objective.setScore(player.scoreboardIdentity, score);
            } catch (e) {
                player.runCommandAsync(`scoreboard players remove @s "${objectName}" ${score}`);
            }
        },
        get: (objectName) => {
            try {
                const objective = world.scoreboard.getObjective(objectName);
                if (!objective) return undefined;
                return objective.getScore(player.scoreboardIdentity);
            } catch (e) {
                return undefined;
            }
        }
    }
}

export function configureNativeFunction() {
    world.getAllPlayers().forEach(player => {
        if (!player.score) player.score = createScoreboardManager(player);
    });
};

system.runInterval(() => configureNativeFunction());