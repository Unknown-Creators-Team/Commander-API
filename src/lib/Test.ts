import { GameMode, system, world } from "@minecraft/server";
import * as Gametest from "@minecraft/server-gametest";
import Vector from "./Vector.js";

type StructureTypes = "empty" | "button_push" | "break_block" | "trip_wire_trip";

type initializeCallback = (entity: Gametest.SimulatedPlayer, test: Gametest.Test) => void;
type RunCallback = (entity: Gametest.SimulatedPlayer, test: Gametest.Test) => Promise<void>;

export default class Test {
    public static readonly tests: string[] = [];
    public name: string;
    public structure: StructureTypes;
    private initializeCallback: initializeCallback | undefined = undefined;
    private runCallback: RunCallback | undefined = undefined;

    constructor(name: string, structure: StructureTypes = "empty") {
        this.name = name;
        this.structure = structure;
    }

    public initialize(callback: initializeCallback): Test {
        this.initializeCallback = callback;

        return this;
    }

    public run(callback: RunCallback): Test {
        this.runCallback = callback;

        return this;
    }

    public register(): void {
        if (Test.tests.includes(this.name)) throw new Error(`Test "${this.name}" is already registered.`);
        if (!this.runCallback) throw new Error("Run callback is not defined.");
        
        Gametest.register("capi", this.name, async (test) => {
            const player = test.spawnSimulatedPlayer({ x: 2, y: 3, z: 2 }, this.name, GameMode.Survival);

            
            if (this.initializeCallback) {
                await system.waitTicks(2);
                console.log(`Initializing test "${this.name}"...`);
                try {
                    this.initializeCallback(player, test);
                } catch (e) {
                    console.error(`${e}\n${e instanceof Error && e.stack}`);
                    test.fail(`Initialization failed: ${e}`);
                    return;
                }
            }

            await system.waitTicks(20);
            console.log(`Running test "${this.name}"...`);

            if (!this.runCallback) throw new Error("Run callback is not defined.");
            try {
                await this.runCallback(player, test);
            } catch (e) {
                console.error(`${e}\n${e instanceof Error && e.stack}`);
                test.fail(`Run failed: ${e}`);
                return;
            }
            // await waitOp(player, test);
            
            // await system.waitTicks(20);

            // player.disconnect();

            // await system.waitTicks(20);

            test.succeed();
        })
            .structureName("capi:" + this.structure)
            .maxTicks(20 * 30);

        Test.tests.push(this.name);
    }

    public static runTest(name: string, location: Vector): void {
        if (!this.tests.includes(name)) throw new Error(`Test "${name}" is not registered.`);
        // /execute positioned 0 0 0 run gametest run testName
        world.getDimension("overworld").runCommand(`execute positioned ${location.add([0, 0, 1]).floor().toString()} run gametest run capi:${name}`);
    }

    public static runAll(location: Vector): void {
        // 平面に広げる感じでテストを実行 (テストコンテナは10ブロック離す)
        const distance = 10;
        let xMax = Math.floor(Math.sqrt(this.tests.length));
        for (let i = 0; i < this.tests.length; i++) {
            const x = i % xMax;
            const y = Math.floor(i / xMax);
            system.runTimeout(() => {
                this.runTest(this.tests[i], location.add([x * distance, 0, y * distance]));
            }, i * 2);
        }
    }

    // private waitOp(player: Gametest.SimulatedPlayer, test: Test, timeout: number = 10000): Promise<boolean> {
    //     const timeoutSec = (timeout / 1000).toFixed(2);

    //     return new Promise((resolve, reject) => {
    //         const start = Date.now();

    //         world.sendMessage(`§b${player.name} §aにOP権限を付与してください (タイムアウト: ${timeoutSec}秒)`);

    //         const interval = system.runInterval(() => {
    //             if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
    //                 system.clearRun(interval);
    //                 resolve(true);
    //             } else if (Date.now() - start > timeout) {
    //                 system.clearRun(interval);
    //                 test.fail(`${timeoutSec}秒以内にOP権限が付与されませんでした`);

    //                 reject(new TimeoutError(timeout));
    //             }
    //         }, 20);
    //     });
    // }
}
