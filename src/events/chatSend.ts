import { RawText, world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { promiseDelay } from "../utils.js";
import { Macro } from "../lib/Macro.js";
import Vector from "lib/Vector.js";

world.beforeEvents.chatSend.subscribe((chat) => {
    const { sender: player, message } = chat;

    for (const tag of player.getTags()) {
        if (tag.startsWith("chat:")) promiseDelay(() => player.removeTag(tag));
        if (tag.startsWith("mute")) {
            chat.cancel = true;
            if (tag.length > 5) player.sendMessage(tag.slice(5));
            else player.sendMessage("§cYou have been muted.");
            return;
        }
    }

    //? cancel chat
    if (config.others.cancelChat.enabled && !chat.cancel) {
        const regex = new RegExp(config.others.cancelChat.pattern);
        if (regex.test(message)) {
            chat.cancel = true;
        }
    }

    //? private chat
    console.log(config.others.privateChat.enabled, chat.cancel);
    if (config.others.privateChat.enabled && !chat.cancel) {
        const id = ScoreboardUtils.getScore(player, config.others.privateChat.objective);
        console.log("Private chat id:", id, undefined);
        if (id) {
            const content = Macro.format(
                player,
                config.others.privateChat.format.replace(/{message}|{msg}/gi, message).replace(/{team}|{group}|{id}/gi, id.toString()),
            );

            const residents = world.getPlayers({ scoreOptions: [{ objective: config.others.privateChat.objective, minScore: id, maxScore: id }] });
            residents.forEach((p) => p.sendMessage(content));
            chat.cancel = true;
        }
    }

    //? custom chat
    if (config.others.customChat.enabled && !chat.cancel) {
        const content = Macro.format(player, config.others.customChat.format.replace(/{message}|{msg}/gi, message));
        if (config.others.customChat.websocket) {
            const [name, message] = content.split("::");
            promiseDelay(() => {
                const entity = player.dimension.spawnEntity("minecraft:armor_stand", player.location);
                entity.nameTag = name;
                entity.runCommand(`say ${message}`);
                entity.remove();
            });
        } else world.sendMessage(content);
        chat.cancel = true;
    }

    promiseDelay(() => {
        player.addTagWillRemove(`capi:${config.events.chatSend.name}`);
        player.addTagWillRemove(`${config.events.chatSend.name}:${message}`);
        ScoreboardUtils.setScore(player, `capi:${config.events.chatSend.name}_len`, message.length);
        ScoreboardUtils.addScore(player, `capi:${config.events.chatSend.name}_cnt`, 1);
        console.log(`Player ${player.name} sent chat: ${message}`);
    });
});
