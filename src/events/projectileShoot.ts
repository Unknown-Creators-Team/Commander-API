import { BlockVolume, Entity, Player, system, world } from "@minecraft/server";
import { FMath } from "lib/FastMath.js";
import Vector from "lib/Vector.js";
import { removeTagsStartsWith } from "util.js";

world.afterEvents.itemStopUse.subscribe((itemStopUse) => {
    const { source: player, itemStack: item } = itemStopUse;

    if (item?.typeId === "minecraft:bow") {
        const shot = getShot(player);
        if (shot) {
            shootEvent(player, shot);
        }
    }
});

world.afterEvents.itemUse.subscribe((itemUse) => {
    const { source: player, itemStack: item } = itemUse;

    if (item.typeId === "minecraft:crossbow") {
        const shot = getShot(player);
        if (shot) {
            shootEvent(player, shot);
        }
    }
});

function getShot(player: Player) {
    const entities = player.dimension.getEntities({ location: player.location, maxDistance: 6, minDistance: 0, type: "minecraft:arrow" });
    return entities.filter(isInAir)[0];
}

function isInAir(entity: Entity) {
    const start = Vector.add(entity.location, new Vector(0, 0.1, 0));
    const end = Vector.add(entity.location, new Vector(0, -0.1, 0));
    const volume = new BlockVolume(start, end);

    return !entity.dimension.containsBlock(volume, { excludeTypes: ["air"] });
}

function shootEvent(player: Player, projectile: Entity) {
    removeTagsStartsWith(player, "shot_with:", "shot_from:");

    player.addTagWillRemove("capi:shot");
    player.addTagWillRemove(`shot_with:${projectile.typeId}`);
    projectile.addTag(`shot_from:${player.name}`);
}
