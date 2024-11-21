import { mixHexColors, type FourHex } from "./colorUtils";

type HourToColors = { [key: number]: FourHex };

export const naturalColors = (time = new Date()): FourHex => {
    const [prevColors, nextColors, weight] = getClosestColors(time);
    const mixedColors = [0, 1, 2, 3].map((idx) =>
        mixHexColors(prevColors[idx], nextColors[idx], weight)
    ) as FourHex;

    return mixedColors;
};

const saturation = 1.35;

export const skyColorsByHour: HourToColors = {
    // [topLayer, ..., ..., bottomLayer]
    0: ["#0e1422", "#0a1c43", "#112f61", "#163d73"],
    2: ["#06040c", "#030119", "#02042f", "#06183f"],
    4: ["#0c1120", "#0e1c40", "#112f61", "#183d71"],
    6: ["#534485", "#745785", "#a97185", "#c38a81"],
    9: ["#5b8fd9", "#90a9c9", "#d7bb93", "#eddd84"],
    12: ["#61a3f1", "#75b3f5", "#8ac4f9", "#94ccfd"],
    15: ["#4682c7", "#4c98e4", "#6bb4ec", "#7dbdec"],
    18: ["#7e547e", "#a9535a", "#e1722b", "#eb9630"],
    21: ["#3a4286", "#825b84", "#c3715d", "#e08044"],
    23: ["#0c1120", "#0b1b42", "#123060", "#1e4171"],
};

export const dayProgress = (time = new Date()) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();
    const ms = ((hours * 60 + minutes) * 60 + seconds) * 100 + milliseconds;
    const progressThroughDay = ms / (24 * 60 * 60 * 100);

    return progressThroughDay;
};

const getClosestColors = (
    time = new Date(),
    skyColorsObject = skyColorsByHour
): [FourHex, FourHex, number] => {
    const hours = Object.keys(skyColorsObject).map((i) => parseInt(i, 10));
    const l = hours.length;
    const progress = dayProgress(time);
    const hoursProgress = hours.map((i) => i / 24);

    let nextIdx = hoursProgress.findIndex((i) => i > progress);
    if (nextIdx === -1) nextIdx = 0;
    const prevIdx = nextIdx === 0 ? l - 1 : nextIdx - 1;

    let nextProgress = hoursProgress[nextIdx];
    if (nextProgress === 0) nextProgress = 1;
    const prevProgress = hoursProgress[prevIdx];
    const maxProgress = nextProgress - prevProgress;

    const weight = (progress - prevProgress) / maxProgress;

    return [
        skyColorsObject[hours[prevIdx]],
        skyColorsObject[hours[nextIdx]],
        weight,
    ];
};
