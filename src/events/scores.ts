import { Block, Entity, world } from "@minecraft/server";
import tickEvent from "../lib/TickEvent.js";
import { removeTagsStartsWith, setScore } from "util.js";
import { FMath } from "lib/FastMath.js";

tickEvent.subscribe("scores", () => {
    for (const player of world.getAllPlayers()) {
        removeTagsStartsWith(player, "view:");

        //? speed
        const velocity = player.getVelocity();
        setScore(player, "capi:velocity_x", FMath.floor(velocity.x * 200));
        setScore(player, "capi:velocity_y", FMath.floor(velocity.y * 200));
        setScore(player, "capi:velocity_z", FMath.floor(velocity.z * 200));
        setScore(player, "capi:velocity_xz", FMath.floor(FMath.hypot(velocity.x, velocity.z) * 200));
        setScore(player, "capi:velocity_xyz", FMath.floor(FMath.hypot(velocity.x, velocity.y, velocity.z) * 200));

        //? vector
        const direction = player.getViewDirection();
        setScore(player, "capi:view_direction_x", FMath.floor(direction.x * 100));
        setScore(player, "capi:view_direction_y", FMath.floor(direction.y * 100));
        setScore(player, "capi:view_direction_z", FMath.floor(direction.z * 100));

        //? input
        const input = player.inputInfo.getMovementVector();
        setScore(player, "capi:input_x", FMath.floor(input.x * 100));
        setScore(player, "capi:input_y", FMath.floor(input.y * 100));

        //? health
        const health = player.getComponent("health")?.currentValue ?? -1;
        setScore(player, "capi:health", FMath.floor(health));

        //? location
        const { location } = player;
        setScore(player, "capi:location_x", FMath.floor(location.x));
        setScore(player, "capi:location_y", FMath.floor(location.y));
        setScore(player, "capi:location_z", FMath.floor(location.z));

        //? rotation
        const rotation = player.getRotation();
        setScore(player, "capi:rotation_x", FMath.floor(rotation.x));
        setScore(player, "capi:rotation_y", FMath.floor(rotation.y));

        //? view direction
        let view : Entity | Block | undefined = player.getEntitiesFromViewDirection()[0]?.entity;
        try { view ??= player.getBlockFromViewDirection()?.block } catch (e) {}
        setScore(player, "capi:view_x", view?.location.x ?? (-2) ** 31);
        setScore(player, "capi:view_y", view?.location.y ?? (-2) ** 31);
        setScore(player, "capi:view_z", view?.location.z ?? (-2) ** 31);
        if (view) try { player.addTag(`view:${view.typeId}`); } catch (e) {}

        //? selected slot
        setScore(player, "capi:slot", player.selectedSlotIndex);

        //? timestamp
        setScore(player, "capi:timestamp", FMath.floor(Date.now() / 1000));

        //? dimension
        const dimensions = [
            "minecraft:nether",
            "minecraft:overworld",
            "minecraft:the_end",
        ];
        setScore(player, "capi:dimension", dimensions.indexOf(player.dimension.id) - 1);

        //? max render distance
        const maxRenderDistance = player.clientSystemInfo.maxRenderDistance;
        setScore(player, "capi:max_render_distance", maxRenderDistance);

        //? memory tier
        const memoryTier = player.clientSystemInfo.memoryTier;
        setScore(player, "capi:memory_tier", memoryTier);

        //? level
        setScore(player, "capi:level", player.level);

        //? total xp
        setScore(player, "capi:total_xp", player.getTotalXp());

        //? xp needed for next level
        setScore(player, "capi:xp_needed_for_next_level", player.totalXpNeededForNextLevel);

        //? xp earned at current level
        setScore(player, "capi:xp_earned_at_current_level", player.xpEarnedAtCurrentLevel);
        
        
    }
});
