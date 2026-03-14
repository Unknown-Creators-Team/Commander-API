import { FMath } from "../../src/lib/FastMath.js";

describe("FMath", () => {
    test("handles basic rounding helpers", () => {
        expect(FMath.abs(-7)).toBe(7);
        expect(FMath.floor(3.9)).toBe(3);
        expect(FMath.floor(-1.2)).toBe(-2);
        expect(FMath.ceil(3.1)).toBe(4);
        expect(FMath.ceil(2)).toBe(2);
        expect(FMath.ceil(-1.2)).toBe(-1);
        expect(FMath.round(1.4)).toBe(1);
        expect(FMath.round(1.5)).toBe(2);
        expect(FMath.round(-1.6)).toBe(-2);
    });

    test("calculates power and hypotenuse", () => {
        expect(FMath.pow(2, 5)).toBe(32);
        expect(FMath.hypot(3, 4, 12)).toBe(13);
    });

    test("returns minimum and maximum values", () => {
        expect(FMath.min(4, -1, 8, 2)).toBe(-1);
        expect(FMath.max(4, -1, 8, 2)).toBe(8);
    });
});
