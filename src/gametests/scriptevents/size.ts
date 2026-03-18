import { system } from "@minecraft/server";
import Test from "lib/Test.js";
import sizeEvent from "../../scriptevents/size.js";
import { Vec3 } from "@bedrock-oss/bedrock-boost";

new Test("scriptevent_size", "empty")
    .initialize((player) => {
        player.dimension.setBlockType(Vec3.from(player.location).add([0, 2, 0]).floor(), "minecraft:stone");
    })
    .run(async (player) => {
        const oldLocation = Vec3.from(player.location);

        sizeEvent(player, "2");
        await system.waitTicks(20);

        const newLocation = Vec3.from(player.location);
        const distance = newLocation.distance(oldLocation);

        if (distance < 1.5) {
            throw new Error(`Player did not grow in size properly. Distance moved: ${distance}`);
        }
    })
    .register();
