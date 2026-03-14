import { Macro } from "./helpers/macroTestHarness.js";

describe("str macro", () => {
    test("returns character at index", () => {
        expect(Macro.format(undefined, "<!str=[abc, at, 0]>")).toBe("a");
        expect(Macro.format(undefined, "<!str=[abc, at, 1]>")).toBe("b");
        expect(Macro.format(undefined, "<!str=[abc, at, 2]>")).toBe("c");
    });

    test("concatenates strings", () => {
        expect(Macro.format(undefined, "<!str=[hello, concat, ' world']>")).toBe("hello world");
        expect(Macro.format(undefined, "<!str=[hello, concat, ', ', world]>")).toBe("hello, world");
    });

    test("returns mapped value when starts_with matches", () => {
        expect(Macro.format(undefined, "<!str=[aaabbbccc, starts_with, aaa, yes, no]>")).toBe("yes");
        expect(Macro.format(undefined, "<!str=[aaabbbccc, starts_with, ccc, yes, no]>")).toBe("no");
        expect(Macro.format(undefined, "<!str=[aaabbbccc, starts_with, aaa]>")).toBe("yes");
        expect(Macro.format(undefined, "<!str=[aaabbbccc, starts_with, ccc]>")).toBe("no");
    });

    test("returns mapped value when ends_with matches", () => {
        expect(Macro.format(undefined, "<!str=[aaabbbccc, ends_with, ccc, yes, no]>")).toBe("yes");
        expect(Macro.format(undefined, "<!str=[aaabbbccc, ends_with, aaa, yes, no]>")).toBe("no");
        expect(Macro.format(undefined, "<!str=[aaabbbccc, ends_with, ccc]>")).toBe("yes");
        expect(Macro.format(undefined, "<!str=[aaabbbccc, ends_with, aaa]>")).toBe("no");
    });

    test("returns mapped value when includes matches", () => {
        expect(Macro.format(undefined, "<!str=[aaabbbccc, includes, bb, yes, no]>")).toBe("yes");
        expect(Macro.format(undefined, "<!str=[aaabbbccc, includes, dd, yes, no]>")).toBe("no");
        expect(Macro.format(undefined, "<!str=[aaabbbccc, includes, bb]>")).toBe("yes");
        expect(Macro.format(undefined, "<!str=[aaabbbccc, includes, dd]>")).toBe("no");
    });

    test("returns index as string", () => {
        expect(Macro.format(undefined, "<!str=[abcd, index_of, c]>")).toBe("2");
        expect(Macro.format(undefined, "<!str=[abcd, index_of, e]>")).toBe("-1");
    });

    test("repeats string by count", () => {
        expect(Macro.format(undefined, "<!str=[abc, repeat, 3]>")).toBe("abcabcabc");
    });

    test("replaces first occurrence", () => {
        expect(Macro.format(undefined, "<!str=[ababa, replace, a, z]>")).toBe("zbaba");
    });

    test("replaces all occurrences", () => {
        expect(Macro.format(undefined, "<!str=[ababa, replace_all, a, z]>")).toBe("zbzbz");
    });

    test("returns sliced substring", () => {
        expect(Macro.format(undefined, "<!str=[abcdef, slice, 1, 4]>")).toBe("bcd");
    });

    test("converts to lower case", () => {
        expect(Macro.format(undefined, "<!str=[AbC, lower_case]>")).toBe("abc");
    });

    test("converts to upper case", () => {
        expect(Macro.format(undefined, "<!str=[AbC, upper_case]>")).toBe("ABC");
    });

    test("trims both ends", () => {
        expect(Macro.format(undefined, "<!str=['  abc  ', trim]>")).toBe("abc");
    });

    test("trims end only", () => {
        expect(Macro.format(undefined, "<!str=['abc   ', trim_end]>")).toBe("abc");
    });

    test("trims start only", () => {
        expect(Macro.format(undefined, "<!str=['   abc', trim_start]>")).toBe("abc");
    });

    test("pads start with fill string", () => {
        expect(Macro.format(undefined, "<!str=[abc, pad_start, 5, O]>")).toBe("OOabc");
    });

    test("pads end with fill string", () => {
        expect(Macro.format(undefined, "<!str=[abc, pad_end, 5, O]>")).toBe("abcOO");
    });

    test("returns length as string", () => {
        expect(Macro.format(undefined, "<!str=[abcdef, length]>")).toBe("6");
    });
});
