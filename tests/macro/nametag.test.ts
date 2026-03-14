import { Macro, createBlockSource, createEntitySource, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("nametag macro", () => {
    beforeEach(resetMacroMocks);

    test("uses the entity nameTag for entities", () => {
        expect(Macro.format(createEntitySource(), "<!nametag>")).toBe("Zombie Boss");
    });

    test("falls back to the block type id for blocks", () => {
        expect(Macro.format(createBlockSource(), "<!nametag>")).toBe("minecraft:command_block");
    });

    test("restores the marker when unresolved", () => {
        expect(Macro.format(undefined, "<!nametag>")).toBe("<nametag>");
    });
});
