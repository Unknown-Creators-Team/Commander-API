import { GameMode, Player, system, world } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

GameTest.registerAsync("commander_api", "kill", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-kill", GameMode.survival);

    const callback = (ev) => {
        const entity = ev.deadEntity;

        if (entity instanceof Player && entity.name === player.name) {
            test.succeed();

            world.afterEvents.entityDie.unsubscribe(callback);
        }
    }

    world.afterEvents.entityDie.subscribe(callback);

    system.runTimeout(() => {
        player.addTag("kill:()");
    }, 20);
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);