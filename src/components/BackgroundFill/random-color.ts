type Troyka = [number, number, number];
type Color = {
    hex: string;
    rgb: Troyka;
    hsb: Troyka;
    luma: number;
};

const hexArray = [
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

export const randomColor = (): Color => {
    let hex = "#";
    for (let x = 0; x < 6; x++) {
        let index = Math.floor(Math.random() * 16);
        let value = hexArray[index];
        hex += value;
    }
    const rgb = hexToRGB(hex);
    const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // percived luminosity

    return {
        hex,
        rgb,
        hsb: hexToHsb(hex),
        luma,
    };
};

export const randomHexColors = () =>
    [1, 2, 3, 4]
        .map(randomColor)
        .sort((i, k) => k.luma - i.luma) // sort by luminosity
        .map((i) => i.hex);

function hexToRGB(h: string): Troyka {
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

function hexToHsb(hex: string): Troyka {
    let [r, g, b] = hexToRGB(hex);

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
