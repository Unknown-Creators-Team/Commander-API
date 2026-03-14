import { Macro, createBlockSource, createEntitySource, createPlayerSource, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("tag macro", () => {
    beforeEach(resetMacroMocks);

    test("extracts the value from a matching tag prefix", () => {
        const source = createPlayerSource({
            getTags: () => ["rank:admin", "rank:moderator", "mode:creative"],
        });

        expect(Macro.format(source, "<!tag=rank>")).toBe("admin");
    });

    test("restores the marker when the tag is missing", () => {
        expect(Macro.format(createEntitySource(), "<!tag=missing>")).toBe("<tag=missing>");
    });

    test("restores the marker for non-entity sources", () => {
        expect(Macro.format(createBlockSource(), "<!tag=rank>")).toBe("<tag=rank>");
    });
});
