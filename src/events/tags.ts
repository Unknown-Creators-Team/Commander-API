import { Timings } from "@bedrock-oss/bedrock-boost";
import { GraphicsMode, PlatformType, PlayerPermissionLevel, system, world } from "@minecraft/server";
import config from "data/config.js";
import { removeTagsStartsWith } from "utils.js";

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        //? is op
        if (config.events.isOp.enabled) {
            if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) player.addTag(`capi:${config.events.isOp.name}`);
            else player.removeTag(`capi:${config.events.isOp.name}`);
        }

        //? is member
        if (config.events.isMember.enabled) {
            if (player.playerPermissionLevel === PlayerPermissionLevel.Member) player.addTag(`capi:${config.events.isMember.name}`);
            else player.removeTag(`capi:${config.events.isMember.name}`);
        }

        //? is visitor
        if (config.events.isVisitor.enabled) {
            if (player.playerPermissionLevel === PlayerPermissionLevel.Visitor) player.addTag(`capi:${config.events.isVisitor.name}`);
            else player.removeTag(`capi:${config.events.isVisitor.name}`);
        }

        //? is flying
        if (config.events.isFlying.enabled) {
            if (player.isFlying) player.addTag(`capi:${config.events.isFlying.name}`);
            else player.removeTag(`capi:${config.events.isFlying.name}`);
        }

        //? is gliding
        if (config.events.isGliding.enabled) {
            if (player.isGliding) player.addTag(`capi:${config.events.isGliding.name}`);
            else player.removeTag(`capi:${config.events.isGliding.name}`);
        }

        //? is jumping
        if (config.events.isJumping.enabled) {
            if (player.isJumping) player.addTag(`capi:${config.events.isJumping.name}`);
            else player.removeTag(`capi:${config.events.isJumping.name}`);
        }

        //? is climbing
        if (config.events.isClimbing.enabled) {
            if (player.isClimbing) player.addTag(`capi:${config.events.isClimbing.name}`);
            else player.removeTag(`capi:${config.events.isClimbing.name}`);
        }

        //? is falling
        if (config.events.isFalling.enabled) {
            if (player.isFalling) player.addTag(`capi:${config.events.isFalling.name}`);
            else player.removeTag(`capi:${config.events.isFalling.name}`);
        }

        //? is in water
        if (config.events.isInWater.enabled) {
            if (player.isInWater) player.addTag(`capi:${config.events.isInWater.name}`);
            else player.removeTag(`capi:${config.events.isInWater.name}`);
        }

        //? is on ground
        if (config.events.isOnGround.enabled) {
            if (player.isOnGround) player.addTag(`capi:${config.events.isOnGround.name}`);
            else player.removeTag(`capi:${config.events.isOnGround.name}`);
        }

        //? is sneaking
        if (config.events.isSneaking.enabled) {
            if (player.isSneaking) player.addTag(`capi:${config.events.isSneaking.name}`);
            else player.removeTag(`capi:${config.events.isSneaking.name}`);
        }

        //? is sprinting
        if (config.events.isSprinting.enabled) {
            if (player.isSprinting) player.addTag(`capi:${config.events.isSprinting.name}`);
            else player.removeTag(`capi:${config.events.isSprinting.name}`);
        }

        //? is swimming
        if (config.events.isSwimming.enabled) {
            if (player.isSwimming) player.addTag(`capi:${config.events.isSwimming.name}`);
            else player.removeTag(`capi:${config.events.isSwimming.name}`);
        }

        //? is sleeping
        if (config.events.isSleeping.enabled) {
            if (player.isSleeping) player.addTag(`capi:${config.events.isSleeping.name}`);
            else player.removeTag(`capi:${config.events.isSleeping.name}`);
        }

        //? is emoting
        if (config.events.isEmoting.enabled) {
            if (player.isEmoting) player.addTag(`capi:${config.events.isEmoting.name}`);
            else player.removeTag(`capi:${config.events.isEmoting.name}`);
        }

        //? is riding
        if (config.events.isRiding.enabled) {
            if (player.isRiding) player.addTag(`capi:${config.events.isRiding.name}`);
            else player.removeTag(`capi:${config.events.isRiding.name}`);
        }

        //? is desktop
        if (config.events.isDesktop.enabled) {
            if (player.clientSystemInfo.platformType === PlatformType.Desktop) player.addTag(`capi:${config.events.isDesktop.name}`);
            else player.removeTag(`capi:${config.events.isDesktop.name}`);
        }

        //? is mobile
        if (config.events.isMobile.enabled) {
            if (player.clientSystemInfo.platformType === PlatformType.Mobile) player.addTag(`capi:${config.events.isMobile.name}`);
            else player.removeTag(`capi:${config.events.isMobile.name}`);
        }

        //? is console
        if (config.events.isConsole.enabled) {
            if (player.clientSystemInfo.platformType === PlatformType.Console) player.addTag(`capi:${config.events.isConsole.name}`);
            else player.removeTag(`capi:${config.events.isConsole.name}`);
        }

        //? graphics is simple
        if (config.events.isGraphicsSimple.enabled) {
            if (player.graphicsMode === GraphicsMode.Simple) player.addTag(`capi:${config.events.isGraphicsSimple.name}`);
            else player.removeTag(`capi:${config.events.isGraphicsSimple.name}`);
        }

        //? graphics is fancy
        if (config.events.isGraphicsFancy.enabled) {
            if (player.graphicsMode === GraphicsMode.Fancy) player.addTag(`capi:${config.events.isGraphicsFancy.name}`);
            else player.removeTag(`capi:${config.events.isGraphicsFancy.name}`);
        }

        //? graphics is deferred
        if (config.events.isGraphicsDeferred.enabled) {
            if (player.graphicsMode === GraphicsMode.Deferred) player.addTag(`capi:${config.events.isGraphicsDeferred.name}`);
            else player.removeTag(`capi:${config.events.isGraphicsDeferred.name}`);
        }

        //? graphics is ray_traced
        if (config.events.isGraphicsRayTraced.enabled) {
            if (player.graphicsMode === GraphicsMode.RayTraced) player.addTag(`capi:${config.events.isGraphicsRayTraced.name}`);
            else player.removeTag(`capi:${config.events.isGraphicsRayTraced.name}`);
        }
    }
});
