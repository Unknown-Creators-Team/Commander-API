import { Block, Entity, EntityQueryOptions, world } from "@minecraft/server";
import { bothParse, calculate } from "util.js";
import ESON from "./ESON.js";
import { ScoreboardUtils } from "./ScriptBoxMC.js";

export namespace Macro {
    export type Source = Entity | Block | undefined;

    export function format(source: Source, value: string): string {
        const tags = value.match(/</g) || [];
        for (const _ of tags) {
            let inner = getInner(value);
            if (!inner) continue;
            console.log("inner:", inner);
            if (inner === "name") {
                value = replace(value, inner, name(source, inner));
            } else if (inner === "nametag") {
                value = replace(value, inner, nametag(source, inner));
            } else if (inner === "nl") {
                value = replace(value, inner, newline());
            } else if (inner === "at") {
                value = replace(value, inner, at());
            } else if (inner.startsWith("tag=")) {
                value = replace(value, inner, tag(source, inner));
            } else if (inner.startsWith("score=")) {
                value = replace(value, inner, score(source, inner));
            } else if (inner.startsWith("velocity=")) {
                value = replace(value, inner, velocity(source, inner));
            } else if (inner.startsWith("calc=")) {
                value = replace(value, inner, calc(inner));
            } else if (inner.startsWith("selector=")) {
                value = replace(value, inner, selector(source, inner));
            } else if (inner.startsWith("if=")) {
                value = replace(value, inner, conditional(inner));
            } else if (inner.startsWith("repeat=")) {
                value = replace(value, inner, repeat(inner));
            } else if (inner.startsWith("match=")) {
                value = replace(value, inner, match(inner));
            }
        }
        return restoreMarkers(value);
    }

    function name(source: Source, value: string): string {
        if (source?.isPlayer()) {
            return source.name;
        }
        if (source?.isEntity()) {
            return source.typeId;
        }
        if (source?.isBlock()) {
            return source.typeId;
        }
        return value;
    }

    function nametag(source: Source, value: string): string {
        if (source?.isEntity()) {
            return source.nameTag;
        }
        if (source?.isBlock()) {
            return source.typeId;
        }
        return value;
    }

    function newline(): string {
        return "\n";
    }

    function at(): string {
        return "@";
    }

    function tag(source: Source, value: string): string {
        if (!source?.isEntity()) return value;
        const object = ESON.parse(value);
        if (object.tag === undefined) return value;
        const tag = source.getTags().find((tag) => tag.startsWith(object.tag + ":"));
        if (!tag) return value;
        const tagValue = tag.slice(object.tag.length + 1);
        return tagValue;
    }

    function score(source: Source, value: string): string {
        if (!source?.isEntity()) return value;
        const object = ESON.parse(value);
        if (object.score === undefined) return value;
        const score = ScoreboardUtils.getScore(source, object.score);
        if (score === undefined) return value;
        return score.toString();
    }

    function velocity(source: Source, value: string): string {
        if (!source?.isEntity()) return value;
        const object = ESON.parse(value);
        if (object.velocity === undefined) return value;
        const type = [...(object.velocity as string)].sort((a, b) => a.localeCompare(b)).join("");
        const vel = source.getVelocity();
        const velocity = {
            ...vel,
            xy: Math.hypot(vel.x, vel.y),
            xz: Math.hypot(vel.x, vel.z),
            yz: Math.hypot(vel.y, vel.z),
            xyz: Math.hypot(vel.x, vel.y, vel.z),
        };
        return velocity[type as keyof typeof velocity].toString();
    }

    function calc(value: string): string {
        const object = ESON.parse(value);
        if (object.calc === undefined) return value;
        try {
            return calculate(object.calc).toString();
        } catch (e) {
            console.error("calc error: ", e);
            return value;
        }
    }

    function selector(source: Source, value: string): string {
        const object = ESON.parse(value);
        if (object.selector === undefined) return value;
        const selector = object.selector;
        const options: EntityQueryOptions = {};
        const dimension = source?.dimension ?? world.getDimension("overworld");
        if (selector.c) options.closest = selector.c;
        if (selector.r) options.maxDistance = selector.r;
        if (selector.rm) options.minDistance = selector.rm;
        if (selector.x || selector.y || selector.z || selector.r) {
            options.location = {
                x: selector.x ?? source?.location.x ?? 0,
                y: selector.y ?? source?.location.y ?? 0,
                z: selector.z ?? source?.location.z ?? 0,
            };
        }
        if (selector.dx || selector.dy || selector.dz) {
            options.volume = {
                x: selector.dx ?? 1,
                y: selector.dy ?? 1,
                z: selector.dz ?? 1,
            };
        }
        if (selector.tag) (options.tags ??= []).push(selector.tag);
        if (selector.tags) {
            for (const tag of selector.tags) {
                if (tag.startsWith("!")) {
                    (options.excludeTags ??= []).push(tag.slice(1));
                } else {
                    (options.tags ??= []).push(tag);
                }
            }
        }
        
        return (options.location ? dimension : world).getPlayers(options).map((player) => player.name).join(", ");
    }

    function conditional(value: string): string {
        const object = ESON.parse(value);
        if (object.if === undefined) return value;
        const [condition, trueValue, falseValue]: [string, string, string | undefined] = object.if;
        if (!condition || !trueValue) return value;
        
        const parts = condition.match(/(.*?)(=|<|<=|!=)(.*)/);
        if (!parts || parts.length < 4) return value;
        const left = parts[1].trim();
        const operator = parts[2];
        const right = parts[3].trim();
        
        let conditionResult: boolean = false;
        const leftNum = parseFloat(left);
        const rightNum = parseFloat(right);
        const bothNumbers = !isNaN(leftNum) && !isNaN(rightNum);

        if (bothNumbers) {
            switch (operator) {
                case "=":
                    conditionResult = leftNum === rightNum;
                    break;
                case "<":
                    conditionResult = leftNum < rightNum;
                    break;
                case "<=":
                    conditionResult = leftNum <= rightNum;
                    break;
                case "!=":
                    conditionResult = leftNum !== rightNum;
                    break;
                default:
                    return value;
            }
        } else {
            switch (operator) {
                case "=":
                    conditionResult = left === right;
                    break;
                case "!=":
                    conditionResult = left !== right;
                    break;
                default:
                    return value;
            }
        }
        return conditionResult ? trueValue : (falseValue ?? "");
    }

    function repeat(value: string): string {
        const object = ESON.parse(value);
        if (object.repeat === undefined) return value;
        const [text, count]: [string, number] = object.repeat;
        if (!count || !text) return value;
        let result = "";
        for (let i = 0; i < count; i++) {
            result += text;
        }
        return result;
    }

    function match(value: string): string {
        const object = ESON.parse(value);
        if (object.match === undefined) return value;
        const [i, ...rest]: [number, string, string, string] = object.match;
        if (i === undefined) return value;
        const result = rest[i];
        if (result === undefined) return value;
        return result;
    }

    function getInner(value: string): string {
        interface Pair {
            start: number;
            end: number;
            depth: number;
        }
        const pairs: Pair[] = [];
        const stack: { index: number; depth: number }[] = [];

        // Scan the string to record all matching <! ...> pairs and their nesting depth.
        for (let i = 0, depth = 0; i < value.length; i++) {
            if (value.substring(i, i + 2) === "<!") {
                depth++;
                stack.push({ index: i, depth });
                i++; // Skip the '!' character as it's part of the marker.
            } else if (value[i] === ">") {
                if (stack.length > 0) {
                    const { index: start, depth: pairDepth } = stack.pop()!;
                    pairs.push({ start, end: i, depth: pairDepth });
                    depth = stack.length; // Adjust depth to current stack size.
                }
            }
        }
        if (pairs.length === 0) return "";

        // Find the maximum nesting depth.
        const maxDepth = Math.max(...pairs.map((p) => p.depth));
        // Select pairs with maximum depth in document order.
        const deepestPairs = pairs.filter((p) => p.depth === maxDepth);

        for (const pair of deepestPairs) {
            // Skip the first two characters ("<!") when extracting inner content.
            let inner = value.slice(pair.start + 2, pair.end);
            // If the inner content is exclusively enclosed by ":" markers, ignore this pair.
            if (/^:.*:$/.test(inner)) {
                // Try to find its immediate parent (enclosing pair).
                const parent = pairs.find((p) => p.start < pair.start && p.end > pair.end);
                if (parent) {
                    inner = value.slice(parent.start + 2, parent.end);
                    return inner;
                }
                // If no parent exists, skip this pair.
            } else {
                return inner;
            }
        }
        return "";
    }

    export function restoreMarkers(str: string): string {
        const regex = /<:(.*?)\:>/g;
        while (regex.test(str)) {
            str = str.replace(regex, "<$1>");
        }
        return str;
    }

    function replace(str: string, value1: string, value2: string): string {
        if (value1 === value2) {
            str = str.replaceAll(`<!${value1}>`, `<:${value1}:>`);
            return str;
        }

        str = str.replaceAll(`<!${value1}>`, value2);
        str = str.replaceAll(`<:${value1}:>`, value2);
        return str;
    }
}
