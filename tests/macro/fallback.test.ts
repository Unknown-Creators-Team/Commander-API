import { Macro, createPlayerSource, mockGetScore, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("fallback macro", () => {
    beforeEach(resetMacroMocks);

    test("uses the fallback when the nested macro stays unresolved", () => {
        mockGetScore.mockReturnValue(undefined);

        expect(Macro.format(createPlayerSource(), "<!fallback=[<!score=coins>,backup]>")).toBe("backup");
    });

    test("returns the original resolved value when no fallback is needed", () => {
        expect(Macro.format(undefined, "<!fallback=[true,false]>")).toBe("true");
        expect(Macro.format(undefined, "<!fallback=[done,backup]>")).toBe("done");
    });

    test("handles explicit unresolved markers", () => {
        expect(Macro.format(undefined, "<!fallback=[<:missing:>,backup]>")).toBe("backup");
    });
});
