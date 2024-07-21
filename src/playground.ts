import * as Minecraft from "@minecraft/server";

const { world, system } = Minecraft;

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { id, message, sourceEntity } = event;
    const player = sourceEntity;
    if (!player?.isPlayer()) return;
    if (id !== "cpg:test") return;

    const location = Vector.add(player.location, { x: 0, y: 5, z: 0 });
    const entity = player.dimension.spawnEntity("minecraft:snowball", location);

    const goto = Vector.subtract({ x: -37, y: 132, z: 78 }, entity.location);
    const speed = 0.1;
    const vector = Vector.multiply(goto, speed);
    entity.applyImpulse(vector);
    // entity.applyKnockback()
}, { namespaces: ["cpg"] });

class Vector {
    static add(v1: Minecraft.Vector3, v2: Minecraft.Vector3): Minecraft.Vector3 {
        return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
    }

    static subtract(v1: Minecraft.Vector3, v2: Minecraft.Vector3): Minecraft.Vector3 {
        return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
    }

    static multiply(v: Minecraft.Vector3, scalar: number): Minecraft.Vector3 {
        return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
    }

    static normalize(v: Minecraft.Vector3): Minecraft.Vector3 {
        const length = Math.hypot(v.x, v.y, v.z);
        return { x: v.x / length, y: v.y / length, z: v.z / length };
    }
}