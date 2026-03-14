import { Macro, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("at macro", () => {
    beforeEach(resetMacroMocks);

    test("supports both aliases", () => {
        expect(Macro.format(undefined, "<!at><!a>")).toBe("@@");
    });

    test("can be embedded in selectors or text", () => {
        expect(Macro.format(undefined, "say <!at>s")).toBe("say @s");
    });
});
