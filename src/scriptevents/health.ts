import { Block, Entity } from "@minecraft/server";
import { Macro } from "lib/Macro.js";
import * as v from "valibot";

export default function main(source: Entity | Block | undefined, message: string) {
    if (!source?.isPlayer()) throw new Error("This event can only be called by a player");

    const healthString = Macro.format(source, message);

    if (!healthString) throw new Error("Health value is required.");

    v.parse(v.pipe(v.string(), v.regex(/^-?(\d|\.)+$/)), healthString, { message: "health must be a valid number" });
    let health = parseFloat(healthString);

    const healthComponent = source.getComponent("health");
    const maxHealth = Math.round(healthComponent?.defaultValue ?? 20);

    health = clamp(health, -maxHealth, maxHealth);
    health = Math.floor(health);
    health = Math.round(source.health ?? 20) + health;
    health = clamp(health, 0, maxHealth);

    healthComponent?.setCurrentValue(health);
}

// minとmaxの範囲内で値を設定するように修正
function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}
