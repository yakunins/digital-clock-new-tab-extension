export type FourHex = [string, string, string, string];
export type Troyka = [number, number, number];
export type Color = {
    hex: string;
    rgb: Troyka;
    hsb: Troyka;
    luma: number;
};

export const hexArray = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
];

export function hexToRgb(h: string): Troyka {
    let [r, g, b] = [0, 0, 0];
    if (h.length == 4) {
        r = parseInt("0x" + h[1] + h[1]);
        g = parseInt("0x" + h[2] + h[2]);
        b = parseInt("0x" + h[3] + h[3]);
    } else if (h.length == 7) {
        r = parseInt("0x" + h[1] + h[2]);
        g = parseInt("0x" + h[3] + h[4]);
        b = parseInt("0x" + h[5] + h[6]);
    }
    return [r, g, b];
}

export function hexToHsb(hex: string): Troyka {
    let [r, g, b] = hexToRgb(hex);

    // Calculate HSB values
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let delta = max - min;

    let h, s, br;

    if (delta === 0) {
        h = 0;
    } else if (max === r) {
        h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
        h = 60 * ((b - r) / delta + 2);
    } else {
        h = 60 * ((r - g) / delta + 4);
    }

    if (h < 0) {
        h += 360;
    }

    s = max === 0 ? 0 : delta / max;
    br = max;

    return [h, s, br];
}

export function rgbToHex(r: number, g: number, b: number) {
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");

    return `#${hexR}${hexG}${hexB}`;
}

const mix = (n1: number, n2: number, weight = 0.5) =>
    Math.round(n1 * (1 - weight) + n2 * weight);

export function mixHexColors(c1: string, c2: string, weight = 0.5) {
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);

    const r = mix(rgb1[0], rgb2[0], weight);
    const g = mix(rgb1[1], rgb2[1], weight);
    const b = mix(rgb1[2], rgb2[2], weight);

    return rgbToHex(r, g, b);
}
