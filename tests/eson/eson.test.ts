import ESON from "bedrock-eson";

describe("ESON", () => {
    test("parses nested objects, arrays, booleans, and quoted strings", () => {
        expect(ESON.parse("{name=alex,stats={level=3,alive=true},items=[apple,'gold ingot'],empty=[]}")).toEqual({
            name: "alex",
            stats: {
                level: 3,
                alive: true,
            },
            items: ["apple", "gold ingot"],
            empty: [],
        });
    });

    test("stringifies nested values into ESON", () => {
        expect(
            ESON.stringify({
                message: "hello world",
                count: 2,
                flags: [true, false],
                nested: { mode: "survival" },
            }),
        ).toBe("{message='hello world',count=2,flags=[true,false],nested={mode=survival}}");
    });

    test("round-trips arrays and primitive values", () => {
        const value = {
            id: "capi:test",
            values: [1, 2, 3],
            enabled: false,
            nullable: null,
        };

        expect(ESON.parse(ESON.stringify(value))).toEqual(value);
    });
});
