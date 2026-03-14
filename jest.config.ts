/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
    coverageProvider: "v8",
    moduleFileExtensions: ["ts", "js", "json"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
        "^data/(.*)\\.js$": "<rootDir>/src/data/$1",
        "^events/(.*)\\.js$": "<rootDir>/src/events/$1",
        "^lib/(.*)\\.js$": "<rootDir>/src/lib/$1",
        "^schema\\.js$": "<rootDir>/src/schema.ts",
        "^scriptevents/(.*)\\.js$": "<rootDir>/src/scriptevents/$1",
        "^slashCommands/(.*)\\.js$": "<rootDir>/src/slashCommands/$1",
        "^utils\\.js$": "<rootDir>/src/utils.ts",
    },
    roots: ["<rootDir>/tests"],
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/scripts/", "<rootDir>/src/gametests/"],
    transform: {
        "^.+\\.[tj]s$": [
            "@swc/jest",
            {
                jsc: {
                    parser: {
                        syntax: "typescript",
                    },
                    target: "es2022",
                },
                module: {
                    type: "commonjs",
                },
            },
        ],
    },
};

export default config;
