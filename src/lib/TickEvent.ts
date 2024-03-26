import { system, world } from '@minecraft/server';

type TickEventCallback = (data: { deltaTime: number, currentTick: number, tps: number }) => any;

class TickEvent {
    subscriptions: Record<string, () => any>;
    lastTickDate: number;
    deltaTime: number;
    currentTick: number;
    tickCheck: (() => void);
    avgDeltaTime: number[];
    tps: number;

    constructor() {
        this.subscriptions = {};
        this.lastTickDate;
        this.deltaTime;
        this.currentTick = 0;
        this.tickCheck;
        this.avgDeltaTime = [];
        this.tps;
    }

    __checkTicks() {
        if (this.tickCheck) return;
        this.tickCheck = () => {
            const { lastTickDate = (new Date()).getTime() } = this;
            this.currentTick++;
            this.deltaTime = (new Date()).getTime() - lastTickDate;
            this.avgDeltaTime.push(this.deltaTime);
            if (this.avgDeltaTime.length > 100) this.avgDeltaTime.shift();
            const { avgDeltaTime } = this;
            this.tps = Math.round((1 / (avgDeltaTime.reduce((t, c) => t + c) / avgDeltaTime.length / 1000)) * 10) / 10;
            this.lastTickDate = (new Date()).getTime();
            system.run(this.tickCheck);
        };
        system.run(this.tickCheck);
    }

    /**
     * @method subscribe
     */
    subscribe(key: string, callback: TickEventCallback) {
        this.__checkTicks();
        this.subscriptions[key] = () => {
            const { deltaTime = 0, currentTick = 0, tps = 20 } = this;
            callback({ deltaTime, currentTick, tps });
            system.run(this.subscriptions[key]);
        };
        system.run(this.subscriptions[key]);
    }

    /**
     * @method unsubscribe
     */
    unsubscribe(key: string) {
        console.warn(Object.keys(this.subscriptions).length);
        if (Object.keys(this.subscriptions).length <= 1) {
            system.run(() => { this.__checkTicks = false; });
        }
        this.subscriptions[key] = () => { };

        system.run(() => {
            delete this.subscriptions[key];
        });
    }
}
const tickEvent = new TickEvent();
export default tickEvent;