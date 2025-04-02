import { getDateString, getTimeString } from "../utils";

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
