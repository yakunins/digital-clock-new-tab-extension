import {
    dayProgress,
    naturalColors,
    skyColorsByHour,
} from "../components/BackgroundFill/naturalColors";
import { mixHexColors } from "../components/BackgroundFill/colorUtils";

const time = (timeString: string) =>
    new Date("Wednesday 28 September 2022 " + timeString);

test("dayProgress", () => {
    const midnight = time("00:00");
    const eight = time("08:00");
    const midday = time("12:00");
    const lastMinute = time("23:59");
    const lastSecond = time("23:59:59");
    expect(dayProgress(midnight)).toBe(0);
    expect(dayProgress(eight)).toBe(0.3333333333333333);
    expect(dayProgress(midday)).toBe(0.5);
    expect(dayProgress(lastMinute)).toBe(1 - 1 / (24 * 60));
    expect(dayProgress(lastSecond)).toBe(0.999988425925926);
});

test("naturalColors", () => {
    let received: any, expected: any;

    const midnight = time("00:00");
    received = naturalColors(midnight);
    expected = skyColorsByHour[0];
    [0, 1, 2, 3].forEach((idx) => expect(received[idx]).toBe(expected[idx]));

    const firstSecond = time("00:00:01");
    received = naturalColors(firstSecond);
    expected = skyColorsByHour[0];
    [0, 1, 2, 3].forEach((idx) => expect(received[idx]).toBe(expected[idx]));

    const two = time("02:00");
    received = naturalColors(two);
    expected = skyColorsByHour[2];
    [0, 1, 2, 3].forEach((idx) => expect(received[idx]).toBe(expected[idx]));

    const one = time("01:00");
    received = naturalColors(one);
    expected = ["#0a0c17", "#070f2e", "#0a1a48", "#0e2b59"];
    [0, 1, 2, 3].forEach((idx) => expect(received[idx]).toBe(expected[idx]));

    const sixteenandahalf = time("16:30:00");
    const c15 = skyColorsByHour[15];
    const c18 = skyColorsByHour[18];
    expected = [0, 1, 2, 3].map((idx) => mixHexColors(c15[idx], c18[idx], 0.5));
    received = naturalColors(sixteenandahalf);
    [0, 1, 2, 3].forEach((idx) => expect(received[idx]).toBe(expected[idx]));

    const lastSecond = time("23:59:59");
    received = naturalColors(lastSecond);
    expected = skyColorsByHour[0];
    [0, 1, 2, 3].forEach((idx) => expect(received[idx]).toBe(expected[idx]));
});
