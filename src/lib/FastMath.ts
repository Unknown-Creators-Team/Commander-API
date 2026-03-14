/**
 * FastMath.ts
 * @description Fast math functions
 * @author @Nano191225
 * @license MIT
 * @version 1.0.0
 */

export class FMath {
    /**
     * Fast absolute value
     * @param x number
     * @returns number
     */
    static abs(x: number): number {
        return x < 0 ? -x : x;
    }

    /**
     * Fast floor value
     * @param x number
     * @returns number
     */
    static floor(x: number): number {
        return x < 0 && x !== (x | 0) ? (x | 0) - 1 : x | 0;
    }

    /**
     * Fast ceil value
     * @param x number
     * @returns number
     */
    static ceil(x: number): number {
        const truncated = x | 0;
        return x > 0 && x !== truncated ? truncated + 1 : truncated;
    }

    /**
     * Fast round value
     * @param x number
     * @returns number
     */
    static round(x: number): number {
        return x < 0 ? -((-x + 0.5) | 0) : (x + 0.5) | 0;
    }

    /**
     * Fast power
     * @param x number
     * @param y number
     * @returns number
     */
    static pow(x: number, y: number): number {
        let result = 1;
        for (let i = 0; i < y; i++) {
            result *= x;
        }
        return result;
    }

    /**
     * Fast hypotenuse
     * @param ...v number
     * @returns number
     */
    static hypot(...v: number[]): number {
        let result = 0;
        for (let i = 0; i < v.length; i++) {
            result += v[i] * v[i];
        }
        return Math.sqrt(result);
    }

    /**
     * Fast minimum value
     * @param ...v number
     * @returns number
     */
    static min(...v: number[]): number {
        let result = v[0];
        for (let i = 1; i < v.length; i++) {
            if (v[i] < result) {
                result = v[i];
            }
        }
        return result;
    }

    /**
     * Fast maximum value
     * @param ...v number
     * @returns number
     */
    static max(...v: number[]): number {
        let result = v[0];
        for (let i = 1; i < v.length; i++) {
            if (v[i] > result) {
                result = v[i];
            }
        }
        return result;
    }

    /**
     * Fast random value
     * @param min number
     * @param max number
     * @returns number
     */
    static random(min: number = 0, max: number = 1): number {
        return Math.random() * (max - min) + min;
    }
}
