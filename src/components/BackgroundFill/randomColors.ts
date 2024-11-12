import {
    hexArray,
    hex2hsb,
    hex2rgb,
    type Color,
    type FourHex,
} from "./colorUtils";

export const randomColor = (): Color => {
    let hex = "#";
    for (let x = 0; x < 6; x++) {
        let index = Math.floor(Math.random() * 16);
        let value = hexArray[index];
        hex += value;
    }
    const rgb = hex2rgb(hex);
    const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // percived luminosity

    return {
        hex,
        rgb,
        hsb: hex2hsb(hex),
        luma,
    };
};

export const randomColors = (): FourHex => {
    const res = [1, 2, 3, 4]
        .map(randomColor)
        .sort((i, k) => k.luma - i.luma) // sort by luminosity
        .map((i) => i.hex);

    return res as FourHex;
};
