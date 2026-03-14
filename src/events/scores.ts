import { Difficulty, system, world } from "@minecraft/server";
import config from "data/config.js";
import { FMath } from "lib/FastMath.js";
import { ScoreboardUtils } from "script-box-mc";
import Vector from "lib/Vector.js";
import { removeTagsStartsWith } from "utils.js";
import tickEvent from "../lib/TickEvent.js";

tickEvent.subscribe("scores", () => {
    for (const player of world.getAllPlayers()) {
        removeTagsStartsWith(player, "view:");

        //? velocity
        if (config.events.velocity.enabled) {
            const velocity = player.getVelocity();
            const xz = FMath.hypot(velocity.x, velocity.z);
            const xyz = FMath.hypot(velocity.x, velocity.y, velocity.z);
            ScoreboardUtils.setScore(player, `capi:${config.events.velocity.name}_x`, FMath.floor(velocity.x * 200));
            ScoreboardUtils.setScore(player, `capi:${config.events.velocity.name}_y`, FMath.floor(velocity.y * 200));
            ScoreboardUtils.setScore(player, `capi:${config.events.velocity.name}_z`, FMath.floor(velocity.z * 200));
            ScoreboardUtils.setScore(player, `capi:${config.events.velocity.name}_xz`, FMath.floor(xz * 200));
            ScoreboardUtils.setScore(player, `capi:${config.events.velocity.name}_xyz`, FMath.floor(xyz * 200));
        }

        //? vector
        if (config.events.viewDirection.enabled) {
            const direction = player.getViewDirection();
            ScoreboardUtils.setScore(player, `capi:${config.events.viewDirection.name}_x`, FMath.floor(direction.x * 100));
            ScoreboardUtils.setScore(player, `capi:${config.events.viewDirection.name}_y`, FMath.floor(direction.y * 100));
            ScoreboardUtils.setScore(player, `capi:${config.events.viewDirection.name}_z`, FMath.floor(direction.z * 100));
        }

        //? input
        if (config.events.movementVector.enabled) {
            const input = player.inputInfo.getMovementVector();
            ScoreboardUtils.setScore(player, `capi:${config.events.movementVector.name}_x`, FMath.floor(input.x * 100));
            ScoreboardUtils.setScore(player, `capi:${config.events.movementVector.name}_y`, FMath.floor(input.y * 100));
        }

        //? health
        if (config.events.health.enabled) {
            const health = player.health ?? -1;
            ScoreboardUtils.setScore(player, `capi:${config.events.health.name}`, FMath.floor(health));
        }

        //? location
        if (config.events.location.enabled) {
            const { location } = player;
            ScoreboardUtils.setScore(player, `capi:${config.events.location.name}_x`, FMath.floor(location.x));
            ScoreboardUtils.setScore(player, `capi:${config.events.location.name}_y`, FMath.floor(location.y + 1 / 65536)); // prevent flooring y when it's .9999...
            ScoreboardUtils.setScore(player, `capi:${config.events.location.name}_z`, FMath.floor(location.z));
        }

        //? rotation
        if (config.events.rotation.enabled) {
            const rotation = player.getRotation();
            ScoreboardUtils.setScore(player, `capi:${config.events.rotation.name}_x`, FMath.floor(rotation.x));
            ScoreboardUtils.setScore(player, `capi:${config.events.rotation.name}_y`, FMath.floor(rotation.y));
        }

        //? block from view direction
        if (config.events.blockFromViewDirection.enabled) {
            const raycast = player.getBlockFromViewDirection()!;
            if (raycast) {
                const { block } = raycast;
                const distance = Vector.distance(player.location, block.location);
                ScoreboardUtils.setScore(player, `capi:${config.events.blockFromViewDirection.name}_distance`, FMath.floor(distance));
                ScoreboardUtils.setScore(player, `capi:${config.events.blockFromViewDirection.name}_x`, FMath.floor(block.location.x));
                ScoreboardUtils.setScore(player, `capi:${config.events.blockFromViewDirection.name}_y`, FMath.floor(block.location.y));
                ScoreboardUtils.setScore(player, `capi:${config.events.blockFromViewDirection.name}_z`, FMath.floor(block.location.z));
            } else {
                ScoreboardUtils.resetScore(player, `capi:${config.events.blockFromViewDirection.name}_distance`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.blockFromViewDirection.name}_x`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.blockFromViewDirection.name}_y`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.blockFromViewDirection.name}_z`);
            }
        }

        //? entity from view direction
        if (config.events.entityFromViewDirection.enabled) {
            const raycast = player.getEntitiesFromViewDirection()[0];
            if (raycast) {
                const { entity, distance } = raycast;
                ScoreboardUtils.setScore(player, `capi:${config.events.entityFromViewDirection.name}_distance`, FMath.floor(distance));
                ScoreboardUtils.setScore(player, `capi:${config.events.entityFromViewDirection.name}_x`, FMath.floor(entity.location.x));
                ScoreboardUtils.setScore(player, `capi:${config.events.entityFromViewDirection.name}_y`, FMath.floor(entity.location.y));
                ScoreboardUtils.setScore(player, `capi:${config.events.entityFromViewDirection.name}_z`, FMath.floor(entity.location.z));
            } else if (!config.events.blockFromViewDirection.enabled) {
                ScoreboardUtils.resetScore(player, `capi:${config.events.entityFromViewDirection.name}_distance`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.entityFromViewDirection.name}_x`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.entityFromViewDirection.name}_y`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.entityFromViewDirection.name}_z`);
            }
        }

        //? selected slot
        if (config.events.selectedSlotIndex.enabled) {
            ScoreboardUtils.setScore(player, `capi:${config.events.selectedSlotIndex.name}`, player.selectedSlotIndex);
        }

        //? timestamp
        if (config.events.timestamp.enabled) {
            ScoreboardUtils.setScore(player, `capi:${config.events.timestamp.name}`, FMath.floor(Date.now() / 1000));
        }

        //? dimension
        if (config.events.dimension.enabled) {
            const dimensions = ["minecraft:nether", "minecraft:overworld", "minecraft:the_end"];
            ScoreboardUtils.setScore(player, `capi:${config.events.dimension.name}`, dimensions.indexOf(player.dimension.id) - 1);
        }

        //? max render distance
        if (config.events.maxRenderDistance.enabled) {
            const maxRenderDistance = player.clientSystemInfo.maxRenderDistance;
            ScoreboardUtils.setScore(player, `capi:${config.events.maxRenderDistance.name}`, maxRenderDistance);
        }

        //? memory tier
        if (config.events.memoryTier.enabled) {
            const memoryTier = player.clientSystemInfo.memoryTier;
            ScoreboardUtils.setScore(player, `capi:${config.events.memoryTier.name}`, memoryTier);
        }

        //? level
        if (config.events.level.enabled) {
            ScoreboardUtils.setScore(player, `capi:${config.events.level.name}`, player.level);
        }

        //? total xp
        if (config.events.totalXp.enabled) {
            ScoreboardUtils.setScore(player, `capi:${config.events.totalXp.name}`, player.getTotalXp());
        }

        //? xp needed for next level
        if (config.events.totalXpNeededForNextLevel.enabled) {
            ScoreboardUtils.setScore(player, `capi:${config.events.totalXpNeededForNextLevel.name}`, player.totalXpNeededForNextLevel);
        }

        //? xp earned at current level
        if (config.events.xpEarnedAtCurrentLevel.enabled) {
            ScoreboardUtils.setScore(player, `capi:${config.events.xpEarnedAtCurrentLevel.name}`, player.xpEarnedAtCurrentLevel);
        }
    }

    //? time of day
    if (config.events.timeOfDay.enabled) {
        ScoreboardUtils.setScore(config.events.timeOfDay.name, "capi:world", world.getTimeOfDay());
    }

    //? day
    if (config.events.day.enabled) {
        ScoreboardUtils.setScore(config.events.day.name, "capi:world", world.getDay());
    }

    //? absolute time
    if (config.events.absoluteTime.enabled) {
        ScoreboardUtils.setScore(config.events.absoluteTime.name, "capi:world", world.getAbsoluteTime());
    }

    //? default spawn location
    if (config.events.defaultSpawnLocation.enabled) {
        const defaultSpawnLocation = world.getDefaultSpawnLocation();
        ScoreboardUtils.setScore(`${config.events.defaultSpawnLocation.name}_x`, "capi:world", defaultSpawnLocation.x);
        ScoreboardUtils.setScore(`${config.events.defaultSpawnLocation.name}_y`, "capi:world", defaultSpawnLocation.y);
        ScoreboardUtils.setScore(`${config.events.defaultSpawnLocation.name}_z`, "capi:world", defaultSpawnLocation.z);
    }

    //? difficulty
    if (config.events.difficulty.enabled) {
        const difficulties = [Difficulty.Peaceful, Difficulty.Easy, Difficulty.Normal, Difficulty.Hard];
        ScoreboardUtils.setScore(config.events.difficulty.name, "capi:world", difficulties.indexOf(world.getDifficulty()));
    }

    //? is hardcore
    if (config.events.isHardcore.enabled) {
        ScoreboardUtils.setScore(config.events.isHardcore.name, "capi:world", world.isHardcore ? 1 : 0);
    }

    //? current tick
    if (config.events.currentTick.enabled) {
        ScoreboardUtils.setScore(config.events.currentTick.name, "capi:world", system.currentTick);
    }

    //? is editor world
    if (config.events.isEditorWorld.enabled) {
        ScoreboardUtils.setScore(config.events.isEditorWorld.name, "capi:world", system.isEditorWorld ? 1 : 0);
    }

    //? system memory tier
    if (config.events.systemMemoryTier.enabled) {
        ScoreboardUtils.setScore(config.events.systemMemoryTier.name, "capi:world", system.serverSystemInfo.memoryTier);
    }

    //? CAPI Extension loaded
    if (config.events.isCapiExtensionLoaded.enabled) {
        ScoreboardUtils.setScore(config.events.isCapiExtensionLoaded.name, "capi:world", system.isCapiExtensionLoaded ? 1 : 0);
    }

    //? CAPI Screen loaded
    if (config.events.isCapiScreenLoaded.enabled) {
        ScoreboardUtils.setScore(config.events.isCapiScreenLoaded.name, "capi:world", system.isCapiScreenLoaded ? 1 : 0);
    }

    // const entities = [
    //     ...world.getDimension("overworld").getEntities({ tags: ["capi:trace"] }),
    //     ...world.getDimension("nether").getEntities({ tags: ["capi:trace"] }),
    //     ...world.getDimension("the_end").getEntities({ tags: ["capi:trace"] })
    // ];

    // for (const entity of entities) {
    //     //? velocity
    //     const velocity = entity.getVelocity();
    //     ScoreboardUtils.setScore(entity, `capi:${config.events.velocity.name}_x", FMath.floor(velocity.x * 200));
    //     ScoreboardUtils.setScore(entity, `capi:${config.events.velocity.name}_y", FMath.floor(velocity.y * 200));
    //     ScoreboardUtils.setScore(entity, `capi:${config.events.velocity.name}_z", FMath.floor(velocity.z * 200));

    //     //? location
    //     const { location } = entity;
    //     ScoreboardUtils.setScore(entity, `capi:${config.events.location.name}_x`, FMath.floor(location.x));
    //     ScoreboardUtils.setScore(entity, `capi:${config.events.location.name}_y`, FMath.floor(location.y));
    //     ScoreboardUtils.setScore(entity, `capi:${config.events.location.name}_z`, FMath.floor(location.z));
    // }
});
