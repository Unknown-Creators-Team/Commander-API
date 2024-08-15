import { system, world } from "@minecraft/server";
class TickEvent {
    subscriptions: Map<string, () => void>;
    lastTickDate: number;
    deltaTime: number;
    currentTick: number;
    tickCheck: any;
    avgDeltaTime: number[];
    tps: number;
    constructor() {
        this.subscriptions = new Map();
        this.lastTickDate = 0;
        this.deltaTime = 50;
        this.currentTick = 0;
        this.tickCheck;
        this.avgDeltaTime = [];
        this.tps = 20.0;
    }
    __checkTicks() {
        if (this.tickCheck) return;
        this.tickCheck = () => {
            const { lastTickDate = new Date().getTime() } = this;
            this.currentTick++;
            this.deltaTime = new Date().getTime() - lastTickDate;
            this.avgDeltaTime.push(this.deltaTime);
            if (this.avgDeltaTime.length > 20) this.avgDeltaTime.shift();
            const { avgDeltaTime } = this;
            this.tps =
                Math.round(
                    (1 /
                        (avgDeltaTime.reduce((t, c) => t + c) /
                            avgDeltaTime.length /
                            1000)) *
                        10
                ) / 10;
            this.lastTickDate = new Date().getTime();
            system.run(this.tickCheck);
        };
        system.run(this.tickCheck);
    }
    /**
     * @method subscribe
     * @param {String} key
     * @param {Function} callback
     */
    subscribe(
        key: string,
        callback: (arg0: {
            deltaTime: any;
            currentTick: number;
            tps: any;
            avgDeltaTime: any[];
        }) => void
    ) {
        this.__checkTicks();
        this.subscriptions.set(key, () => {
            const {
                deltaTime = 0,
                currentTick = 0,
                tps = 20,
                avgDeltaTime = [],
            } = this;
            callback({ deltaTime, currentTick, tps, avgDeltaTime });
            system.run(this.subscriptions.get(key) ?? (() => {}));
        });
        system.run(this.subscriptions.get(key) ?? (() => {}));
    }

    /**
     * @method unsubscribe
     * @param {String} key
     */
    unsubscribe(key: string) {
        // content.warn(Object.keys(this.subscriptions).length);
        if (Object.keys(this.subscriptions).length <= 1) {
            system.run(() => {
                this.__checkTicks = () => {};
            });
        }
        this.subscriptions.set(key, () => {});

        system.run(() => {
            this.subscriptions.delete(key);
        });
    }
}
const tickEvent = new TickEvent();
export default tickEvent;

Array.prototype.forEach;
