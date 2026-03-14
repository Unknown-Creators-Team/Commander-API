import { Macro, createBlockSource, createPlayerSource, mockGetScore, resetMacroMocks } from "./helpers/macroTestHarness.js";

describe("pos macro", () => {
    beforeEach(resetMacroMocks);

    test("reads a stored position from scoreboard values", () => {
        mockGetScore.mockImplementation((_source: unknown, key: string) => ({
            home_x: 10,
            home_y: 64,
            home_z: -5,
        })[key]);

        expect(Macro.format(createPlayerSource(), "<!pos=home>"))
            .toBe("10 64 -5");
    });

    test("supports scalar and vector offsets", () => {
        mockGetScore.mockImplementation((_source: unknown, key: string) => ({
            spawn_x: 1,
            spawn_y: 2,
            spawn_z: 3,
            camp_x: 10,
            camp_y: 20,
            camp_z: 30,
        })[key]);

        expect(Macro.format(createPlayerSource(), "<!pos=[spawn,2]>"))
            .toBe("3 4 5");
        expect(Macro.format(createPlayerSource(), "<!pos=[camp,1,2,3]>"))
            .toBe("11 22 33");
    });

    test("returns an empty string when a score is missing and throws for non-entities", () => {
        mockGetScore.mockImplementation((_source: unknown, key: string) => ({
            base_x: 10,
            base_y: 64,
        })[key]);

        expect(Macro.format(createPlayerSource(), "<!pos=base>"))
            .toBe("");
        expect(() => Macro.format(createBlockSource(), "<!pos=base>"))
            .toThrow("This macro can only be used by an entity");
    });
});