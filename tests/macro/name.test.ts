import { Macro, createBlockSource, createEntitySource, createPlayerSource, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("name macro", () => {
    beforeEach(resetMacroMocks);

    test("uses the player name for players", () => {
        expect(Macro.format(createPlayerSource(), "<!name>")).toBe("Commander");
    });

    test("uses the type id for entities and blocks", () => {
        expect(Macro.format(createEntitySource(), "<!name>")).toBe("minecraft:zombie");
        expect(Macro.format(createBlockSource(), "<!name>")).toBe("minecraft:command_block");
    });

    test("restores the marker when no source is available", () => {
        expect(Macro.format(undefined, "prefix <!name> suffix")).toBe("prefix <name> suffix");
    });
});
