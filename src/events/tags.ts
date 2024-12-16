import { PlatformType, world } from "@minecraft/server";
import tickEvent from "../lib/TickEvent.js";

tickEvent.subscribe("tags", () => {
    for (const player of world.getAllPlayers()) {
        //? is op
        if (player.isOp()) player.addTag("capi:op");
        else player.removeTag("capi:op");

        //? flying
        if (player.isFlying) player.addTag("capi:fly");
        else player.removeTag("capi:fly");

        //? gliding
        if (player.isGliding) player.addTag("capi:glide");
        else player.removeTag("capi:glide");

        //? jumping
        if (player.isJumping) player.addTag("capi:jump");
        else player.removeTag("capi:jump");

        //? climbing
        if (player.isClimbing) player.addTag("capi:climb");
        else player.removeTag("capi:climb");

        //? falling
        if (player.isFalling) player.addTag("capi:fall");
        else player.removeTag("capi:fall");

        //? in water
        if (player.isInWater) player.addTag("capi:in_water");
        else player.removeTag("capi:in_water");

        //? on ground
        if (player.isOnGround) player.addTag("capi:on_ground");
        else player.removeTag("capi:on_ground");

        //? sneaking
        if (player.isSneaking) player.addTag("capi:sneak");
        else player.removeTag("capi:sneak");

        //? sprinting
        if (player.isSprinting) player.addTag("capi:sprint");
        else player.removeTag("capi:sprint");

        //? swimming
        if (player.isSwimming) player.addTag("capi:swim");
        else player.removeTag("capi:swim");

        //? sleeping
        if (player.isSleeping) player.addTag("capi:sleep");
        else player.removeTag("capi:sleep");

        //? emoting
        if (player.isEmoting) player.addTag("capi:emote");
        else player.removeTag("capi:emote");

        //? riding
        if (player.getComponent("riding")?.entityRidingOn.isEntity()) player.addTag("capi:ride");
        else player.removeTag("capi:ride");

        //? is desktop
        if (player.clientSystemInfo.platformType === PlatformType.Desktop) player.addTag("capi:desktop");
        else player.removeTag("capi:desktop");

        //? is mobile
        if (player.clientSystemInfo.platformType === PlatformType.Mobile) player.addTag("capi:mobile");
        else player.removeTag("capi:mobile");

        //? is console
        if (player.clientSystemInfo.platformType === PlatformType.Console) player.addTag("capi:console");
        else player.removeTag("capi:console");
    }
});
