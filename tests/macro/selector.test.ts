import {
    Macro,
    createPlayerSource,
    mockDimensionGetPlayers,
    mockGetDimension,
    mockWorldGetPlayers,
    resetMacroMocks,
} from "./helpers/macroTestHarness.js";

describe("selector macro", () => {
    beforeEach(resetMacroMocks);

    test("uses world.getPlayers when no location is needed", () => {
        mockWorldGetPlayers.mockReturnValue([{ name: "Alpha" }, { name: "Beta" }]);

        expect(Macro.format(undefined, "<!selector={c=2,tags=[builder,!muted],tag=staff}>")).toBe("Alpha, Beta");
        expect(mockWorldGetPlayers).toHaveBeenCalledWith({
            closest: 2,
            excludeTags: ["muted"],
            tags: ["staff", "builder"],
        });
    });

    test("uses the source dimension when a location-based query is required", () => {
        const source = createPlayerSource();
        mockDimensionGetPlayers.mockReturnValue([{ name: "Gamma" }]);

        expect(Macro.format(source, "<!selector={r=5,dx=4,dy=2,dz=1}>")).toBe("Gamma");
        expect(mockDimensionGetPlayers).toHaveBeenCalledWith({
            location: { x: 10, y: 64, z: -5 },
            maxDistance: 5,
            volume: { x: 4, y: 2, z: 1 },
        });
    });

    test("falls back to overworld when no source exists but coordinates are provided", () => {
        mockDimensionGetPlayers.mockReturnValue([{ name: "Delta" }]);

        expect(Macro.format(undefined, "<!selector={x=1,y=2,z=3,rm=4}>")).toBe("Delta");
        expect(mockGetDimension).toHaveBeenCalledWith("overworld");
        expect(mockDimensionGetPlayers).toHaveBeenCalledWith({
            location: { x: 1, y: 2, z: 3 },
            minDistance: 4,
        });
    });
});
