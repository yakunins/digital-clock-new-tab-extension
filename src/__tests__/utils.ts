import { getDateString } from "../components/utils";

test("getDateString", () => {
    const locale = "en-US";
    const day = new Date("28 September 2022");
    expect(getDateString(locale, day)).toBe("Wednesday 28 September 2022");
});
