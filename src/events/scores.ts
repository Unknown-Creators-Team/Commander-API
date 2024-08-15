import { world } from "@minecraft/server";
import tickEvent from "../lib/TickEvent.js";

tickEvent.subscribe("scores", () => {
    for (const player of world.getAllPlayers()) {
        // speed
        player.score.set("Capi:speedX", Math.round(player.getVelocity().x * 10));
        player.score.set("Capi:speedY", Math.round(player.getVelocity().y * 10));
        player.score.set("Capi:speedZ", Math.round(player.getVelocity().z * 10));
        player.score.set("Capi:speedXZ", Math.round(Math.sqrt(player.getVelocity().x ** 2 + player.getVelocity().z ** 2) * 10));
        player.score.set(
            "Capi:speedXYZ",
            Math.round(Math.sqrt(player.getVelocity().x ** 2 + player.getVelocity().y ** 2 + player.getVelocity().z ** 2) * 10)
        );

        // vector
        player.score.set("Capi:vectorX", Math.round(player.getViewDirection().x * 100));
        player.score.set("Capi:vectorY", Math.round(player.getViewDirection().y * 100));
        player.score.set("Capi:vectorZ", Math.round(player.getViewDirection().z * 100));

        // health
        const health = Math.round(player.getComponent("health")?.currentValue ?? -1);
        player.score.set("Capi:health", health);

        // pos
        player.score.set("Capi:x", Math.floor(player.location.x));
        player.score.set("Capi:y", Math.floor(player.location.y));
        player.score.set("Capi:z", Math.floor(player.location.z));

        // rotation
        player.score.set("Capi:rx", Math.floor(player.getRotation().x));
        player.score.set("Capi:ry", Math.floor(player.getRotation().y));

        // selected slot
        player.score.set("Capi:slot", player.selectedSlotIndex);

        // timestamp
        player.score.set("Capi:timestamp", Math.floor(Date.now() / 1000));

        // dimension
        if (player.dimension.id === "minecraft:overworld") player.score.set("Capi:dimension", 0);
        else if (player.dimension.id === "minecraft:nether") player.score.set("Capi:dimension", -1);
        else if (player.dimension.id === "minecraft:the_end") player.score.set("Capi:dimension", 1);
        else player.score.set("Capi:dimension", -2);

        // fall distance
        // ! Removed due to sabotage by Microsoft
        // player.score.set("Capi:fall", Math.round(player.fallDistance));
    }
});
