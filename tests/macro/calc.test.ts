import { Macro, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("calc macro", () => {
    beforeEach(resetMacroMocks);

    test("respects operator precedence", () => {
        expect(Macro.format(undefined, "<!calc=1+2*3>")).toBe("7");
    });

    test("supports math functions and unary negatives", () => {
        expect(Macro.format(undefined, "<!calc=sqrt(81)>")).toBe("9");
        expect(Macro.format(undefined, "<!calc=-3+2>")).toBe("-1");
    });

    test("supports rand through the underlying calculator", () => {
        jest.spyOn(Math, "random").mockReturnValueOnce(0.25);

        expect(Macro.format(undefined, "<!calc=rand>")).toBe("0.25");
    });
});
