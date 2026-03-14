import { Macro, createBlockSource, createPlayerSource, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("velocity macro", () => {
    beforeEach(resetMacroMocks);

    test("reads scalar velocity axes", () => {
        const source = createPlayerSource({
            getVelocity: () => ({ x: 3, y: 4, z: 12 }),
        });

        expect(Macro.format(source, "<!velocity=x>")).toBe("3");
        expect(Macro.format(source, "<!velocity=y>")).toBe("4");
        expect(Macro.format(source, "<!velocity=z>")).toBe("12");
    });

    test("calculates combined magnitudes", () => {
        const source = createPlayerSource({
            getVelocity: () => ({ x: 3, y: 4, z: 12 }),
        });

        expect(Macro.format(source, "<!velocity=xy>")).toBe("5");
        expect(Macro.format(source, "<!velocity=xz>")).toBe(Math.hypot(3, 12).toString());
        expect(Macro.format(source, "<!velocity=yz>")).toBe(Math.hypot(4, 12).toString());
        expect(Macro.format(source, "<!velocity=xyz>")).toBe("13");
    });

    test("restores the marker for non-entity sources", () => {
        expect(Macro.format(createBlockSource(), "<!velocity=xyz>")).toBe("<velocity=xyz>");
    });
});
