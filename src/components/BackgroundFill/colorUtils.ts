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

export function hex2rgb(h: string): Troyka {
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

// output: h in [0,360], s,b in [0,100]
function rgb2hsb(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    let v = max;

    if (delta !== 0) {
        s = delta / max;
        switch (max) {
            case r:
                h = (g - b) / delta + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }
        h *= 60;
    }
    return [round(h), round(s * 100), round(v * 100)];
}

// output: h in [0,360], s,b in [0,100]
export function hex2hsb(hex: string) {
    const rgb = hex2rgb(hex);
    return rgb2hsb(...rgb) as Troyka;
}

export function rgb2hex(r: number, g: number, b: number) {
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");

    return `#${hexR}${hexG}${hexB}`;
}

// input: h in [0,360] and s,br in [0,100]
function hsb2rgb(h: number, s: number, br: number) {
    s /= 100;
    br /= 100;

    const k = (n: number) => (n + h / 60) % 6;
    const f = (n: number) =>
        br * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));

    return [
        Math.round(255 * f(5)),
        Math.round(255 * f(3)),
        Math.round(255 * f(1)),
    ] as Troyka;
}

const mix = (n1: number, n2: number, weight = 0.5) =>
    Math.round(n1 * (1 - weight) + n2 * weight);

export function mixHexColors(c1: string, c2: string, weight = 0.5) {
    const rgb1 = hex2rgb(c1);
    const rgb2 = hex2rgb(c2);

    const r = mix(rgb1[0], rgb2[0], weight);
    const g = mix(rgb1[1], rgb2[1], weight);
    const b = mix(rgb1[2], rgb2[2], weight);

    return rgb2hex(r, g, b);
}

export const saturateColor = (c: string, val: number) => {
    const hsb = hex2hsb(c);
    let saturation = hsb[1] * val;
    if (saturation > 100) saturation = 100;
    if (saturation < 0) saturation = 0;
    hsb[1] = saturation;
    const rgb = hsb2rgb(...hsb);
    const hex = rgb2hex(...rgb);
    return hex;
};

export const lightenColor = (c: string, val: number) => {
    const hsb = hex2hsb(c);
    let brightness = hsb[2] * val;
    if (brightness > 100) brightness = 100;
    if (brightness < 0) brightness = 0;
    hsb[2] = brightness;
    const rgb = hsb2rgb(...hsb);
    const hex = rgb2hex(...rgb);
    return hex;
};

export const saturateColors = (colors: FourHex, val: number) =>
    colors.map((c) => saturateColor(c, val)) as FourHex;

const round = (n: number, precision = 0.01): number => {
    const res = Math.round(n / precision) * precision;
    return res;
};
