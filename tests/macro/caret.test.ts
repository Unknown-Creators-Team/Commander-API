import { Macro, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("caret macro", () => {
    beforeEach(resetMacroMocks);

    test("supports both aliases", () => {
        expect(Macro.format(undefined, "<!caret><!c>")).toBe("^^");
    });

    test("works in command fragments", () => {
        expect(Macro.format(undefined, "tp <!c><!c><!c>")).toBe("tp ^^^");
    });
});
