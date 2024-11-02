import { mixHexColors } from "../components/BackgroundFill/colorUtils";

test("mixHexColors", () => {
    const c1a = "#abc";
    const c1b = "#bcd";
    expect(mixHexColors(c1a, c1b)).toBe("#b3c4d5");
    expect(mixHexColors(c1a, c1b, 0.3)).toBe("#afc0d1");

    const c2a = "#abcdef";
    const c2b = "#654321";
    expect(mixHexColors(c2a, c2b)).toBe("#888888");
    expect(mixHexColors(c2a, c2b, 0.3)).toBe("#96a4b1"); // why not #96a3b1?
});
