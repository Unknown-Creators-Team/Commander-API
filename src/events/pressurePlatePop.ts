import { Vector3, world } from "@minecraft/server";

world.afterEvents.pressurePlatePop.subscribe(pressurePlatePop => {
    const { block, dimension } = pressurePlatePop;
    const { x, y, z } = block;

    const distance = (location: Vector3) => Math.sqrt(((location.x - x) ** 2) + ((location.y - y) ** 2) + ((location.z - z) ** 2));

    const player = world.getPlayers().reduce((a, b) => distance(a.location) < distance(b.location) ? a : b, world.getPlayers()[0]);

    if (!player.isPlayer()) return;

    player.score.set("Capi:plateX", x);
    player.score.set("Capi:plateY", y);
    player.score.set("Capi:plateZ", z);
    player.addTagWillRemove(`Capi:pop`);
});