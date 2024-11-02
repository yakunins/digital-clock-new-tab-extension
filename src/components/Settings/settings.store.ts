import { makeObservable, observable, computed, action } from "mobx";
import { getLocaleAmpm } from "../utils";
import { randomColors } from "../BackgroundFill/randomColors";
import { naturalColors } from "../BackgroundFill/naturalColors";

type Settings = {
    clockType: "24-hour" | "ampm";
    colorSchema: "natural" | "random" | string;
    colors?: [string, string, string, string];
    css?: string;
    segmentLength: number;
    segmentThickness: number;
    status?: string;
};
export type SettingsStore = Settings & {
    setClockType: (val: Settings["clockType"]) => void;
    setColorSchema: (val: Settings["colorSchema"]) => void;
    setCss: (val: Settings["css"]) => void;
    setLength: (val: Settings["segmentLength"]) => void;
    setThickness: (val: Settings["segmentThickness"]) => void;
    setTime: () => void;
    reset: () => void;
};

const css = `:root {
    --clock-color: rgba(160, 255, 230, 1);
    --clock-gap: 0.75rem;
    --clock-frame-opacity: .1;
}`;

const defaults: Settings = {
    clockType: getLocaleAmpm() ? "ampm" : "24-hour",
    colorSchema: "natural",
    colors: ["#fff", "#aaa", "#666", "#000"],
    css: css,
    segmentLength: 50,
    segmentThickness: 50,
};

class ExtensionSettingsStore implements SettingsStore {
    clockType = defaults.clockType;
    colorSchema = defaults.colorSchema;
    css = defaults.css;
    segmentLength = defaults.segmentLength;
    segmentThickness = defaults.segmentThickness;
    time = new Date();
    backgroundUpdatePeriod = 2 * 1000; // 2 seconds between repaint if colorSchema === "natural"

    constructor() {
        makeObservable(this, {
            clockType: observable,
            colorSchema: observable,
            css: observable,
            segmentLength: observable,
            segmentThickness: observable,
            time: observable,
            colors: computed,
            status: computed,
            setClockType: action,
            setColorSchema: action,
            setCss: action,
            setLength: action,
            setThickness: action,
            setTime: action,
            reset: action,
        });
        setInterval(() => this.setTime(), this.backgroundUpdatePeriod);
        chrome.storage.sync.get(
            {
                clockType: this.clockType,
                colorSchema: this.colorSchema,
                segmentLength: this.segmentLength,
                segmentThickness: this.segmentThickness,
                css: this.css,
            },
            (items) => {
                //console.log("chrome.storage.sync.get()", items);
                this.setClockType(items.clockType, true);
                this.setColorSchema(items.colorSchema, true);
                this.setLength(items.segmentLength, true);
                this.setThickness(items.segmentThickness, true);
                this.setCss(items.css, true);
            }
        );
        chrome.storage.onChanged.addListener((changes, namespace) => {
            // namespace === "sync" here
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (oldValue === newValue) return;
                //console.log("chrome.storage.onChanged()", key);
                if (key === "clockType") this.setClockType(newValue, true);
                if (key === "colorSchema") this.setColorSchema(newValue, true);
                if (key === "segmentLength") this.setLength(newValue, true);
                if (key === "segmentThickness")
                    this.setThickness(newValue, true);
                if (key === "css") this.setCss(newValue, true);
            }
        });
    }

    get status() {
        const status = `
            clockType: ${this.clockType},
            colorSchema: ${this.colorSchema},
            css: ${this.css},
            segmentLength: ${this.segmentLength},
            segmentThickness: ${this.segmentThickness},
            time: ${this.time},
            colors: ${this.colors}
        `;
        return status;
    }

    get colors() {
        switch (this.colorSchema) {
            case "natural":
                return naturalColors(this.time);
            case "random":
                return randomColors();
            default:
                if (hasValidColors(this.colorSchema)) {
                    return JSON.parse(this.colorSchema);
                } else {
                    return defaults.colors;
                }
        }
    }

    setClockType(val: Settings["clockType"], fromStorage = false) {
        if (this.clockType === val) return;
        this.clockType = val;
        !fromStorage && chrome.storage.sync.set({ clockType: this.clockType });
    }

    setColorSchema(val: Settings["colorSchema"], fromStorage = false) {
        if (this.colorSchema === val) return;
        isValidSchema(val)
            ? (this.colorSchema = val)
            : (this.colorSchema = defaults.colorSchema);
        !fromStorage &&
            chrome.storage.sync.set({ colorSchema: this.colorSchema });
    }

    setLength(val: Settings["segmentLength"], fromStorage = false) {
        if (this.segmentLength === val) return;
        val <= 100 && val >= 10
            ? (this.segmentLength = val)
            : (this.segmentLength = defaults.segmentLength);
        !fromStorage &&
            throttledStorageSet({ segmentLength: this.segmentLength });
    }

    setThickness(val: Settings["segmentThickness"], fromStorage = false) {
        if (this.segmentThickness === val) return;
        val <= 100 && val >= 10
            ? (this.segmentThickness = val)
            : (this.segmentThickness = defaults.segmentThickness);
        !fromStorage &&
            throttledStorageSet({ segmentThickness: this.segmentThickness });
    }

    setCss(val: Settings["css"], fromStorage = false) {
        if (this.css === val) return;
        this.css = val;
        !fromStorage && throttledStorageSet({ css: this.css });
    }

    setTime() {
        this.time = new Date();
    }

    reset() {
        this.setClockType(defaults.clockType);
        this.setColorSchema(defaults.colorSchema);
        this.setLength(defaults.segmentLength);
        this.setThickness(defaults.segmentThickness);
        this.setCss(defaults.css);
    }
}

const isValidSchema = (val: Settings["colorSchema"]) =>
    val === "natural" || val === "random" || hasValidColors(val);

const hasValidColors = (s: string) => {
    if (!isValidJSON(s)) return false;
    const arr = JSON.parse(s);
    if (!Array.isArray(arr)) return false;
    if (arr.length !== 4) return false;
    return true;
};

const isValidJSON = (str: string) => {
    try {
        JSON.parse(str);
    } catch {
        return false;
    }
    return true;
};

function throttled(fn: Function, throttlePeriod = 350) {
    const state = {
        t: null,
    };
    return (...args: any) => {
        if (state.t) {
            clearTimeout(state.t);
        }
        (state.t as any) = setTimeout(() => {
            fn(...args);
            state.t = null;
        }, throttlePeriod);
    };
}

const throttledStorageSet = throttled((obj: Object) => {
    chrome.storage.sync.set(obj);
});

export const SettingsStore = new ExtensionSettingsStore();
