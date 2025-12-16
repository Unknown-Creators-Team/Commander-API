import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";
import { promiseDelay } from "../utils.js";

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

    promiseDelay(() => {
        player.addTagWillRemove(`capi:${config.events.chatSend.name}`);
        player.addTagWillRemove(`${config.events.chatSend.name}:${message}`);
        ScoreboardUtils.setScore(player, `capi:${config.events.chatSend.name}_len`, message.length);
        ScoreboardUtils.addScore(player, `capi:${config.events.chatSend.name}_cnt`, 1);
        console.log(`Player ${player.name} sent chat: ${message}`);
    });

    return;
    // let msg = chat.message;
    // let mute: string | undefined = undefined;
    // player.getTags().forEach((t) => {
    //     t = t.replace(/"/g, "");
    //     if (t.startsWith("chat:")) system.run(() => player.removeTag(t));
    //     if (t.startsWith("mute:")) mute = t.slice(5);
    // });
    // player.addTagWillRemove(`Capi:chat`);
    // player.addTagWillRemove(`chat:${msg.replace(/"/g, "")}`);
    // player.score.set("Capi:chatLength", msg.length);
    // player.score.add("Capi:chatCount", 1);
    // if (Config.get("CancelSendMsgEnabled")) {
    //     const CancelSendMsg = Config.get("CancelSendMsg") as { start: string[]; end: string[]; include: string[] };
    //     const start = CancelSendMsg?.start.some((v) => v.length && msg.startsWith(v));
    //     const end = CancelSendMsg?.end.some((v) => v.length && msg.endsWith(v));
    //     const include = CancelSendMsg?.include.some((v) => v.length && msg.includes(v));
    //     if (start || end || include) return (chat.cancel = true);
    // }
    // if (mute !== undefined || player.hasTag("mute")) {
    //     // player.sendMessage(mute ? mute : "§cYou have been muted.");
    //     return (chat.cancel = true);
    // }
    // if (player.score.get("Capi:privatechat")) {
    //     const resident = world.getPlayers().filter((p) => p.score.get("Capi:privatechat") === player.score.get("Capi:privatechat"));

    //     resident.forEach((p) => {
    //         p.sendMessage(`§i【プライベート】§r §l${player.name}§r §7>>§r ${msg}`);
    //     });

    //     return (chat.cancel = true);
    // }
    // if (Config.get("ChatUIEnabled")) {
    //     const text = format(player, String(Config.get("ChatUI")));
    //     // text ? world.sendMessage(text.replace(/({message}|{msg})/gi, msg)) : 0;
    //     return (chat.cancel = true);
    // }
});
