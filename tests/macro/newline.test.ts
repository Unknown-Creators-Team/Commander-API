import { Macro, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("newline macro", () => {
    beforeEach(resetMacroMocks);

    test("supports both aliases", () => {
        expect(Macro.format(undefined, "A<!nl>B<!n>C")).toBe("A\nB\nC");
    });

    test("works inside surrounding text", () => {
        expect(Macro.format(undefined, "before<!n>after")).toBe("before\nafter");
    });
});
