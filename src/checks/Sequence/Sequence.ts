import * as GameTest from "@minecraft/server-gametest";
import { checkUtils } from "../checkUtils";

type SequenceFunctionReturns = boolean | { "reason": string }
type SequenceFunctionData = (() => Promise<SequenceFunctionReturns>) | (() => SequenceFunctionReturns);
type SequenceData = {
    name: string,
    awaitTicks: number,
    execute: SequenceFunctionData,
    endAfterSucceed: boolean
};


export class Sequence {
    private test: GameTest.Test;
    private sequences: SequenceData[];

    constructor(test: GameTest.Test) {
        this.test = test;
        this.sequences = [];
    }

    public addSequence(name: string, execute: SequenceFunctionData, awaitTicks: number = 0, endAfterSucceed: boolean = false) {
        this.sequences.push({
            name,
            awaitTicks,
            execute,
            endAfterSucceed
        });

        return this;
    }

    public addWait(name: string, ticks: number) {
        this.addSequence(name, () => checkUtils.wait(ticks), 0, false);

        return this;
    }

    public addWaitPromise(name: string, promise: Promise<any>) {
        this.addSequence(name, () => promise, 0, false);

        return this;
    }

    public run() {
        (async () => {
            let sequenceId = 0;

            for await (const sequence of this.sequences) {
                try {
                    const result = await sequence.execute();

                    if (result !== true && (result === false || result.reason)) {
                        this.test.fail(`シーケンス §b${sequence.name} [sequenceId: ${sequenceId}]§c が失敗しました${result !== false ? "\n" + result.reason : ""}`);
                        return;
                    }

                    if (sequence.awaitTicks > 0) {
                        await checkUtils.wait(sequence.awaitTicks);
                    }

                    if (sequence.endAfterSucceed) {
                        this.test.succeed();
                        return;
                    }

                    sequenceId++;
                } catch (e) {
                    console.warn(e + e.stack);
                    this.test.fail(`シーケンス §b${sequence.name} [sequenceId: ${sequenceId}]§c が失敗しました\n${e}`);
                    return;
                }
            }
        })();
    }
}