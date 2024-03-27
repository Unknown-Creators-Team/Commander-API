import { system, world } from "@minecraft/server";
import { SimulatedPlayer, Test } from "@minecraft/server-gametest";

class TimeoutError extends Error {
    constructor(timeMs: number) {
        super(`Timeout ${timeMs}ms`);
    }
}

export namespace checkUtils {
    export function waitOp(player: SimulatedPlayer, test: Test, timeout: number = 10000): Promise<boolean> {
        const timeoutSec = (timeout / 1000).toFixed(2);

        return new Promise((resolve, reject) => {
            const start = Date.now();

            world.sendMessage(`§b${player.name} §aにOP権限を付与してください (タイムアウト: ${timeoutSec}秒)`);

            const interval = system.runInterval(() => {
                if (player.isOp()) {
                    system.clearRun(interval);
                    resolve(true);
                } else if (Date.now() - start > timeout) {
                    system.clearRun(interval);
                    test.fail(`${timeoutSec}秒以内にOP権限が付与されませんでした`);

                    reject(new TimeoutError(timeout));
                }
            }, 20);
        });
    }

    export function wait(tick: number): Promise<boolean> {
        return new Promise((resolve) => {
            system.runTimeout(() => {
                resolve(true);
            }, tick);
        });
    }
}