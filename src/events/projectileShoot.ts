import { Vec3 } from "@bedrock-oss/bedrock-boost";
import { BlockVolume, Entity, Player, world } from "@minecraft/server";
import config from "data/config.js";
import { propertyArray, removeTagsStartsWith } from "utils.js";

world.afterEvents.itemStopUse.subscribe((itemStopUse) => {
    const { source: player, itemStack: item } = itemStopUse;

    if (item?.typeId === "minecraft:bow") {
        const nearbyArrow = getNearbyArrow(player);
        if (nearbyArrow) {
            shootEvent(player, nearbyArrow);
        }
    }
});

world.afterEvents.itemUse.subscribe((itemUse) => {
    const { source: player, itemStack: item } = itemUse;

    if (item.typeId === "minecraft:crossbow") {
        const nearbyArrow = getNearbyArrow(player);
        if (nearbyArrow) {
            shootEvent(player, nearbyArrow);
        }
    }
});

function getNearbyArrow(player: Player) {
    const entities = player.dimension.getEntities({ location: player.location, maxDistance: 6, minDistance: 0, type: "minecraft:arrow" });
    return entities.filter(isInAir)[0];
}

function isInAir(entity: Entity) {
    const start = Vec3.from(entity.location).add(0, 0.1, 0);
    const end = Vec3.from(entity.location).add(0, -0.1, 0);
    const volume = new BlockVolume(start, end);

    return !entity.dimension.containsBlock(volume, { excludeTypes: ["air"] });
}

function shootEvent(player: Player, projectile: Entity) {
    const data = {
        with: projectile.typeId,
        from: player.name,
    };

    removeTagsStartsWith(player, `${config.events.projectileShoot.name}.`);

    player.addTagWillRemove(`capi:${config.events.projectileShoot.name}`);

    for (const value of propertyArray(data)) {
        player.addTagWillRemove(`${config.events.projectileShoot.name}.${value}`);
    }

    console.log(`Player ${player.name} shot projectile ${projectile.typeId}`);
}
