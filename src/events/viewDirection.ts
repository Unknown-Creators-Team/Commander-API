import { Vec3 } from "@bedrock-oss/bedrock-boost";
import { system, world } from "@minecraft/server";
import config from "data/config";
import { ScoreboardUtils } from "script-box-mc";

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (config.events.viewDirection.enabled) {
            const direction = player.getViewDirection();
            ScoreboardUtils.setScore(player, `capi:${config.events.viewDirection.name}_x`, Math.floor(direction.x * 100));
            ScoreboardUtils.setScore(player, `capi:${config.events.viewDirection.name}_y`, Math.floor(direction.y * 100));
            ScoreboardUtils.setScore(player, `capi:${config.events.viewDirection.name}_z`, Math.floor(direction.z * 100));
        }

        if (config.events.blockFromViewDirection.enabled) {
            const blockIdCache = player.getDynamicProperty("capi:view_block_id") as string;
            const raycast = player.getBlockFromViewDirection();
            if (raycast?.block.isValid) {
                const { block } = raycast;
                const distance = Vec3.from(block.location).distance(player.location);
                ScoreboardUtils.setScore(player, `capi:${config.events.blockFromViewDirection.name}_distance`, Math.floor(distance));
                ScoreboardUtils.setScore(player, `capi:${config.events.blockFromViewDirection.name}_x`, Math.floor(block.location.x));
                ScoreboardUtils.setScore(player, `capi:${config.events.blockFromViewDirection.name}_y`, Math.floor(block.location.y));
                ScoreboardUtils.setScore(player, `capi:${config.events.blockFromViewDirection.name}_z`, Math.floor(block.location.z));
                if (block.typeId !== blockIdCache) {
                    player.removeTag(`capi:${config.events.blockFromViewDirection.name}.block:${blockIdCache}`);
                    player.addTag(`capi:${config.events.blockFromViewDirection.name}.block:${block.typeId}`);
                    player.setDynamicProperty("capi:view_block_id", block.typeId);
                }
            } else {
                ScoreboardUtils.resetScore(player, `capi:${config.events.blockFromViewDirection.name}_distance`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.blockFromViewDirection.name}_x`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.blockFromViewDirection.name}_y`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.blockFromViewDirection.name}_z`);
                player.removeTag(`capi:${config.events.blockFromViewDirection.name}.block:${blockIdCache}`);
                player.setDynamicProperty("capi:view_block_id");
            }
        }

        //? entity from view direction
        if (config.events.entityFromViewDirection.enabled) {
            const entityIdCache = player.getDynamicProperty("capi:view_entity_id") as string;
            const playerNameCache = player.getDynamicProperty("capi:view_player_name") as string;
            const raycast = player.getEntitiesFromViewDirection()[0];
            if (raycast) {
                const { entity, distance } = raycast;
                ScoreboardUtils.setScore(player, `capi:${config.events.entityFromViewDirection.name}_distance`, Math.floor(distance));
                ScoreboardUtils.setScore(player, `capi:${config.events.entityFromViewDirection.name}_x`, Math.floor(entity.location.x));
                ScoreboardUtils.setScore(player, `capi:${config.events.entityFromViewDirection.name}_y`, Math.floor(entity.location.y));
                ScoreboardUtils.setScore(player, `capi:${config.events.entityFromViewDirection.name}_z`, Math.floor(entity.location.z));
                if (entity.typeId !== entityIdCache) {
                    player.removeTag(`capi:${config.events.entityFromViewDirection.name}.entity:${entityIdCache}`);
                    player.addTag(`capi:${config.events.entityFromViewDirection.name}.entity:${entity.typeId}`);
                    player.setDynamicProperty("capi:view_entity_id", entity.typeId);
                }
            } else {
                ScoreboardUtils.resetScore(player, `capi:${config.events.entityFromViewDirection.name}_distance`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.entityFromViewDirection.name}_x`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.entityFromViewDirection.name}_y`);
                ScoreboardUtils.resetScore(player, `capi:${config.events.entityFromViewDirection.name}_z`);
                player.removeTag(`capi:${config.events.entityFromViewDirection.name}.entity:${entityIdCache}`);
                player.removeTag(`capi:${config.events.entityFromViewDirection.name}.player:${playerNameCache}`);
                player.setDynamicProperty("capi:view_player_name");
                player.setDynamicProperty("capi:view_entity_id");
            }
        }

        //?
        // if (config.events.view.enabled) {
        //     const blockIdCache = player.getDynamicProperty("capi:view_block_id") as string;
        //     const entityIdCache = player.getDynamicProperty("capi:view_entity_id") as string;
        //     const playerNameCache = player.getDynamicProperty("capi:view_player_name") as string;
        //     const viewEntity = player.getEntitiesFromViewDirection({ ...config.events.view.options })[0];
        //     const viewBlock = player.getBlockFromViewDirection({ ...config.events.view.options });

        //     if (viewBlock?.block.isValid) {
        //         const blockId = viewBlock.block.typeId;
        //         if (blockIdCache !== blockId) {
        //             player.removeTag(`capi:${config.events.view.name}.block:${blockIdCache}`);
        //             // removeTagsStartsWith(player, `${config.events.view.name}.block:`);
        //             player.addTag(`${config.events.view.name}.block:${blockId}`);
        //             player.setDynamicProperty("capi:view_block_id", blockId);
        //         }
        //     } else {
        //         player.removeTag(`capi:${config.events.view.name}.block:${blockIdCache}`);
        //         player.setDynamicProperty("capi:view_block_id");
        //         // removeTagsStartsWith(player, `${config.events.view.name}.block:`);
        //     }

        //     if (viewEntity) {
        //         const entity = viewEntity.entity;
        //         if (entity.typeId !== entityIdCache) {
        //             player.removeTag(`capi:${config.events.view.name}.entity:${entityIdCache}`);
        //             // removeTagsStartsWith(player, `${config.events.view.name}.entity`);
        //             player.addTag(`${config.events.view.name}.entity:${entity.typeId}`);
        //             player.setDynamicProperty("capi:view_entity_id", entity.typeId);
        //         }
        //         if (entity.isPlayer() && entity.name !== playerNameCache) {
        //             player.removeTag(`capi:${config.events.view.name}.player:${playerNameCache}`);
        //             // removeTagsStartsWith(player, `${config.events.view.name}.player`);
        //             player.addTag(`${config.events.view.name}.player:${entity.name}`);
        //             player.setDynamicProperty("capi:view_player_name", entity.name);
        //         }
        //     } else {
        //         // removeTagsStartsWith(player, `${config.events.view.name}.entity`);
        //         // removeTagsStartsWith(player, `${config.events.view.name}.player`);
        //         player.removeTag(`capi:${config.events.view.name}.entity:${entityIdCache}`);
        //         player.removeTag(`capi:${config.events.view.name}.player:${playerNameCache}`);
        //         player.setDynamicProperty("capi:view_entity_id");
        //         player.setDynamicProperty("capi:view_player_name");
        //     }
        // }
    }
});
