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
// @ts-nocheck

import * as Minecraft from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";
import config from "data/config.js";
import { promiseDelay } from "utils.js";

const { world, system } = Minecraft;

Object.assign(Minecraft.Entity.prototype, {
    addTagWillRemove(tag: string) {
        promiseDelay(() => {
            this.addTag(tag);
            if (!config.basic.tag.enabled) return;
            system.runTimeout(() => this.isValid && this.removeTag(tag), config.basic.tag.ticks ?? 10);
        });
    },
    removeTags(tags: string[]) {
        tags.forEach((tag) => this.removeTag(tag));
    },
    addTags(tags: string[]) {
        tags.forEach((tag) => this.addTag(tag));
    },
});

Object.defineProperties(Minecraft.system, {
    isCapiExtensionLoaded: {
        value: (() => {
            const result = world.getDimension("overworld").runCommand("function capi/484227b3-bcdc-472e-92e2-fbbd4a09ff11");
            if (result.successCount) return true;
            return false;
        })(),
        configurable: true,
    },
    isCapiScreenLoaded: {
        value: (() => {
            const result = world.getDimension("overworld").runCommand("function capi/0fd91de9-51ac-4f61-a6d8-4cf4fdbb528c");
            if (result.successCount) return true;
            return false;
        })(),
        configurable: true,
    },
});
