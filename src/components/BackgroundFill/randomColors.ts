import {
    hexArray,
    hex2hsb,
    hex2rgb,
    lightenColor,
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
    const hsb = hex2hsb(hex);
    const luma = 0.3 * rgb[0] ** 2 + 0.59 * rgb[1] ** 2 + 0.12 * rgb[2] ** 2; // percived luminosity
    const brightness = hsb[2]; // brightness

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
