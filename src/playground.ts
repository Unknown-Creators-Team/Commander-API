import * as Minecraft from "@minecraft/server";
import Vector from "lib/Vector.js";

const { world, system } = Minecraft;

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { id, message, sourceEntity } = event;
    const player = sourceEntity;
    if (!player?.isPlayer()) return;
    if (id !== "cpg:test") return;

    const location = Vector.add(player.location, { x: 0, y: 5, z: 0 });
    const entity = player.dimension.spawnEntity("minecraft:wind_charge_projectile", location);

    const goto = Vector.subtract({ x: -37, y: 132, z: 78 }, entity.location);
    const speed = 0.1;
    const vector = Vector.multiply(goto, speed);
    entity.applyImpulse(vector);
    // entity.applyKnockback()
}, { namespaces: ["cpg"] });