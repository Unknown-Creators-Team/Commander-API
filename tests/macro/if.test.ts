import { Macro, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("if macro", () => {
    beforeEach(resetMacroMocks);

    test("supports numeric comparisons", () => {
        expect(Macro.format(undefined, "<!if=[3=3,yes,no]>")).toBe("yes");
        expect(Macro.format(undefined, "<!if=[2<5,yes,no]>")).toBe("yes");
        expect(Macro.format(undefined, "<!if=[5<=5,yes,no]>")).toBe("yes");
        expect(Macro.format(undefined, "<!if=[5!=3,yes,no]>")).toBe("yes");
    });

    test("supports string comparisons and empty false branches", () => {
        expect(Macro.format(undefined, "<!if=[alpha=alpha,ok,no]>")).toBe("ok");
        expect(Macro.format(undefined, "<!if=[alpha!=beta,ok,no]>")).toBe("ok");
        expect(Macro.format(undefined, "<!if=[1=2,yes]>")).toBe("");
    });

    test("restores the marker when an unsupported string operator is used", () => {
        expect(Macro.format(undefined, "<!if=[alpha<bravo,yes,no]>")).toBe("<if=[alpha<bravo,yes,no]>");
    });
});
