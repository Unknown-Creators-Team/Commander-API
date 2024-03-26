import { GameMode, Player, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import * as GameTest from "@minecraft/server-gametest";

GameTest.registerAsync("commander_api", "run", async (test) => {
    const player = test.spawnSimulatedPlayer({ "x": 2, "y": 3, "z": 2 }, "Test-run", GameMode.survival);

    const listener = (ev: ScriptEventCommandMessageAfterEvent) => {
        if (ev.id !== "capi_test:test_run") return;
        if (!ev.sourceEntity || !(ev.sourceEntity instanceof Player)) return;

        if (ev.sourceEntity.name === player.name) {
            test.succeed();

            system.afterEvents.scriptEventReceive.unsubscribe(listener);
        }
    }

    system.afterEvents.scriptEventReceive.subscribe(listener);

    system.runTimeout(() => {
        player.addTag("run:['scriptevent capi_test:test_run Hi']");
    }, 20);
})
    .structureName("Capi:test_box")
    .maxTicks(20 * 30);