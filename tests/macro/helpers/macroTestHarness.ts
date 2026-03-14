const mockGetScore = jest.fn();
const mockWorldGetPlayers = jest.fn();
const mockDimensionGetPlayers = jest.fn();
const mockGetDimension = jest.fn((_dimensionId?: string) => ({
    getPlayers: (options?: unknown) => mockDimensionGetPlayers(options),
}));

jest.spyOn(console, "log").mockImplementation(() => undefined);

jest.mock("@minecraft/server", () => ({
    world: {
        getDimension: (dimensionId: string) => mockGetDimension(dimensionId),
        getPlayers: (options?: unknown) => mockWorldGetPlayers(options),
    },
}), { virtual: true });

jest.mock("../../../src/lib/ScriptBoxMC.js", () => ({
    ScoreboardUtils: {
        getScore: (target: unknown, objective: string) => mockGetScore(target, objective),
    },
}));

import { Macro } from "../../../src/lib/Macro.js";

type MockLocation = {
    x: number;
    y: number;
    z: number;
};

type MockDimension = {
    getPlayers: (options?: unknown) => unknown[];
};

type MockPlayerSource = {
    dimension: MockDimension;
    getTags: () => string[];
    getVelocity: () => MockLocation;
    isBlock: () => false;
    isEntity: () => true;
    isPlayer: () => true;
    location: MockLocation;
    name: string;
    nameTag: string;
    typeId: string;
};

type MockEntitySource = {
    dimension: MockDimension;
    getTags: () => string[];
    getVelocity: () => MockLocation;
    isBlock: () => false;
    isEntity: () => true;
    isPlayer: () => false;
    location: MockLocation;
    nameTag: string;
    typeId: string;
};

type MockBlockSource = {
    dimension: MockDimension;
    isBlock: () => true;
    isEntity: () => false;
    isPlayer: () => false;
    location: MockLocation;
    typeId: string;
};

type MacroMockPlayerSource = MockPlayerSource & Macro.Source;
type MacroMockEntitySource = MockEntitySource & Macro.Source;
type MacroMockBlockSource = MockBlockSource & Macro.Source;

function createMockDimension(): MockDimension {
    return {
        getPlayers: (options?: unknown) => mockDimensionGetPlayers(options),
    };
}

function buildSource<T extends { dimension: MockDimension; location: MockLocation }>(base: T, overrides: Partial<T> = {}): T {
    return {
        ...base,
        ...overrides,
        dimension: overrides.dimension ?? base.dimension,
        location: overrides.location ?? base.location,
    } as T;
}

export function resetMacroMocks(): void {
    mockGetScore.mockReset();
    mockWorldGetPlayers.mockReset();
    mockDimensionGetPlayers.mockReset();
    mockGetDimension.mockClear();

    mockWorldGetPlayers.mockReturnValue([]);
    mockDimensionGetPlayers.mockReturnValue([]);
}

export function createPlayerSource(overrides: Partial<MockPlayerSource> = {}): MacroMockPlayerSource {
    return buildSource({
        dimension: createMockDimension(),
        getTags: () => ["rank:admin", "mode:creative"],
        getVelocity: () => ({ x: 3, y: 4, z: 12 }),
        isBlock: () => false,
        isEntity: () => true,
        isPlayer: () => true,
        location: { x: 10, y: 64, z: -5 },
        name: "Commander",
        nameTag: "CommanderTag",
        typeId: "minecraft:player",
    }, overrides) as MacroMockPlayerSource;
}

export function createEntitySource(overrides: Partial<MockEntitySource> = {}): MacroMockEntitySource {
    return buildSource({
        dimension: createMockDimension(),
        getTags: () => ["rank:miniboss", "state:angry"],
        getVelocity: () => ({ x: 6, y: 8, z: 0 }),
        isBlock: () => false,
        isEntity: () => true,
        isPlayer: () => false,
        location: { x: 3, y: 70, z: 9 },
        nameTag: "Zombie Boss",
        typeId: "minecraft:zombie",
    }, overrides) as MacroMockEntitySource;
}

export function createBlockSource(overrides: Partial<MockBlockSource> = {}): MacroMockBlockSource {
    return buildSource({
        dimension: createMockDimension(),
        isBlock: () => true,
        isEntity: () => false,
        isPlayer: () => false,
        location: { x: 1, y: 2, z: 3 },
        typeId: "minecraft:command_block",
    }, overrides) as MacroMockBlockSource;
}

export {
    Macro,
    mockGetDimension,
    mockGetScore,
    mockDimensionGetPlayers,
    mockWorldGetPlayers,
};