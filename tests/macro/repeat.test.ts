import { Macro, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("repeat macro", () => {
    beforeEach(resetMacroMocks);

    test("repeats text the requested number of times", () => {
        expect(Macro.format(undefined, "<!repeat=['ha',3]>")).toBe("hahaha");
    });

    test("supports zero repetitions", () => {
        expect(Macro.format(undefined, "<!repeat=['ha',0]>")).toBe("");
    });
});
