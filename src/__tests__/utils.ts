import { getDateString, getTimeString, cx } from "../utils";

const day = new Date("28 September 2022");

test("getDateString", () => {
    const locale = "en-US";

    expect(getDateString(locale, "long", 0, day)).toBe(
        "Wednesday, September 28"
    );
    expect(getDateString(locale, "long", -15, day)).toBe(
        "Tuesday, September 27"
    );
});

test("getTimeString", () => {
    const locale = "en-US";

    expect(getTimeString(locale, 0, day)).toBe("12:00 am");
    expect(getTimeString(locale, 15, day)).toBe("12:15 am");
    expect(getTimeString(locale, -15, day)).toBe("11:45 pm");
});

test("cx (merges class names correctly)", () => {
    const result = cx(
        "btn",
        "btn",
        "btn-primary",
        { active: true, disabled: false },
        ["extra", { visible: true, hidden: false }],
        null,
        undefined,
        false,
        0,
        -123,
        ["nested", ["deeplyNested", { deep: true }]],
        { tested: undefined }
    );

    expect(result).toBe(
        "btn btn-primary active extra visible 0 -123 nested deeplyNested deep"
    );
});
