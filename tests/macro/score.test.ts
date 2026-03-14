import { Macro, createBlockSource, createPlayerSource, mockGetScore, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("score macro", () => {
    beforeEach(resetMacroMocks);

    test("reads the score through ScoreboardUtils", () => {
        const source = createPlayerSource();
        mockGetScore.mockReturnValue(42);

        expect(Macro.format(source, "<!score=coins>")).toBe("42");
        expect(mockGetScore).toHaveBeenCalledWith(source, "coins");
    });

    test("restores the marker when no score exists", () => {
        mockGetScore.mockReturnValue(undefined);

        expect(Macro.format(createPlayerSource(), "<!score=coins>")).toBe("<score=coins>");
    });

    test("restores the marker for non-entity sources", () => {
        expect(Macro.format(createBlockSource(), "<!score=coins>")).toBe("<score=coins>");
    });
});
