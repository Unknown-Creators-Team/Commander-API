import { world } from "@minecraft/server";
import tickEvent from "../lib/TickEvent";

tickEvent.subscribe("tags", () => {
    for (const player of world.getAllPlayers()) {
        // is op
        if (player.isOp()) player.addTag("Capi:hasOp");
        else player.removeTag("Capi:hasOp");

        // flying
        if (player.isFlying) player.addTag("Capi:flying");
        else player.removeTag("Capi:flying");

        // gliding
        if (player.isGliding) player.addTag("Capi:gliding");
        else player.removeTag("Capi:gliding");

        // jumping
        if (player.isJumping) player.addTag("Capi:jumping");
        else player.removeTag("Capi:jumping");

        // climbing
        if (player.isClimbing) player.addTag("Capi:climbing");
        else player.removeTag("Capi:climbing");

        // falling
        if (player.isFalling) player.addTag("Capi:falling");
        else player.removeTag("Capi:falling");

        // in water
        if (player.isInWater) player.addTag("Capi:inWater");
        else player.removeTag("Capi:inWater");

        // on ground
        if (player.isOnGround) player.addTag("Capi:onGround");
        else player.removeTag("Capi:onGround");

        // sneaking
        if (player.isSneaking) player.addTag("Capi:sneaking");
        else player.removeTag("Capi:sneaking");

        // sprinting
        if (player.isSprinting) player.addTag("Capi:sprinting");
        else player.removeTag("Capi:sprinting");

        // swimming
        if (player.isSwimming) player.addTag("Capi:swimming");
        else player.removeTag("Capi:swimming");

        // sleeping
        if (player.isSleeping) player.addTag("Capi:sleeping");
        else player.removeTag("Capi:sleeping");

        // emoting
        if (player.isEmoting) player.addTag("Capi:emoting");
        else player.removeTag("Capi:emoting");
    }
});
