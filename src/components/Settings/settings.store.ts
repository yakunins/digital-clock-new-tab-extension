import { makeObservable, observable, computed, action } from "mobx";
import { getLocaleAmpm } from "../utils";
import { getId } from "../utils";
import { randomColors } from "../BackgroundFill/randomColors";
import { naturalColors } from "../BackgroundFill/naturalColors";

type Settings = {
    backgroundRepaintPeriod?: number;
    clockType: "24-hour" | "ampm";
    colorSchema: "sky" | "random" | "fixed";
    fixedColors: string;
    css: string;
    dateStyle: "long" | "short" | "none";
    segmentLength: number;
    segmentThickness: number;
    status?: string;
    storageThrottlePeriod?: number;
    // multiple stores handling
    storeId: string;
    origin: "unknown" | "tab" | "popup" | "options";
    isActive: boolean; // store belongs to last active tab
};
export type SettingsStore = Settings & {
    setClockType: (val: Settings["clockType"]) => void;
    setColorSchema: (val: Settings["colorSchema"]) => void;
    setCss: (val: Settings["css"]) => void;
    setDateStyle: (val: Settings["dateStyle"]) => void;
    setLength: (val: Settings["segmentLength"]) => void;
    setThickness: (val: Settings["segmentThickness"]) => void;
    setBackgroundRepaint: () => void;
    reset: () => void;
};

const css = `:root {
  --color: rgba(160, 255, 230, 1);
}
.clock {
  --clock-gap: 0.75rem;
  --clock-frame-opacity: 0;
}`;
const activeRequestPrefix = "set_active_store_id";

const initial: Settings = {
    backgroundRepaintPeriod: 2 * 1000,
    clockType: getLocaleAmpm() ? "ampm" : "24-hour",
    colorSchema: "sky",
    fixedColors: JSON.stringify(["#fff", "#aaa", "#666", "#000"]),
    css: css,
    dateStyle: "long",
    segmentLength: 50,
    segmentThickness: 50,
    storageThrottlePeriod: 100,
    storeId: getId(),
    origin: "unknown",
    isActive: true,
};

class ExtensionSettingsStore implements SettingsStore {
    clockType = initial.clockType;
    colorSchema = initial.colorSchema;
    css = initial.css;
    dateStyle = initial.dateStyle;
    fixedColors = initial.fixedColors;
    segmentLength = initial.segmentLength;
    segmentThickness = initial.segmentThickness;
    backgroundRepaintTimer = new Date();
    // handling different SettingsStore's in tab, popups and settings
    storeId = initial.storeId;
    origin = initial.origin;
    isActive = initial.isActive;

    constructor() {
        makeObservable(this, {
            backgroundRepaintTimer: observable,
            clockType: observable,
            colorSchema: observable,
            css: observable,
            dateStyle: observable,
            segmentLength: observable,
            segmentThickness: observable,
            status: computed,
            setBackgroundRepaint: action,
            setClockType: action,
            setColorSchema: action,
            setCss: action,
            setDateStyle: action,
            setFixedColors: action,
            setLength: action,
            setThickness: action,
            reset: action,
        });

        setInterval(() => {
            this.setBackgroundRepaint();
        }, initial.backgroundRepaintPeriod);

        chrome.storage.sync.get(
            {
                clockType: this.clockType,
                colorSchema: this.colorSchema,
                segmentLength: this.segmentLength,
                segmentThickness: this.segmentThickness,
                css: this.css,
                dateStyle: this.dateStyle,
                fixedColors: this.fixedColors,
            },
            (items) => {
                this.setClockType(items.clockType, false);
                this.setColorSchema(items.colorSchema, false);
                this.setLength(items.segmentLength, false);
                this.setThickness(items.segmentThickness, false);
                this.setCss(items.css, false);
                this.setDateStyle(items.dateStyle, false);
                this.setFixedColors(items.fixedColors, false);
            }
        );

        chrome.storage.onChanged.addListener((changes, namespace) => {
            // namespace === "sync" here
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (oldValue === newValue) return;
                // console.log("storage.onChanged:", key, newValue);
                if (key === "lastActiveStore")
                    this.setActiveStore(newValue, false);
                if (key === "clockType") this.setClockType(newValue, false);
                if (key === "colorSchema") this.setColorSchema(newValue, false);
                if (key === "segmentLength") this.setLength(newValue, false);
                if (key === "segmentThickness")
                    this.setThickness(newValue, false);
                if (key === "css") this.setCss(newValue, false);
                if (key === "dateStyle") this.setDateStyle(newValue, false);
                if (key === "fixedColors") this.setFixedColors(newValue, false);
            }
        });
    }

    get status() {
        const status = `
            backgroundRepaintTimer: ${this.backgroundRepaintTimer},
            clockType: ${this.clockType},
            colorSchema: ${this.colorSchema},
            dateStyle: ${this.dateStyle},
            segmentLength: ${this.segmentLength},
            segmentThickness: ${this.segmentThickness},
            fixedColors: ${this.fixedColors}
            origin: ${this.origin}
        `;
        return status;
    }

    setClockType(val: Settings["clockType"], store = true) {
        if (this.clockType === val) return;
        this.clockType = val;
        if (store) chrome.storage.sync.set({ clockType: this.clockType });
    }

    setColorSchema(val: Settings["colorSchema"], store = true) {
        if (this.colorSchema === val) return;
        this.colorSchema = val;
        if (store) set({ colorSchema: this.colorSchema });
    }

    setLength(val: Settings["segmentLength"], store = true) {
        if (this.segmentLength === val) return;
        val <= 100 && val >= 10
            ? (this.segmentLength = val)
            : (this.segmentLength = initial.segmentLength);
        if (store) throttledSet({ segmentLength: this.segmentLength });
    }

    setThickness(val: Settings["segmentThickness"], store = true) {
        if (this.segmentThickness === val) return;
        val <= 100 && val >= 10
            ? (this.segmentThickness = val)
            : (this.segmentThickness = initial.segmentThickness);
        if (store) throttledSet({ segmentThickness: this.segmentThickness });
    }

    setCss(val: Settings["css"], store = true) {
        if (this.css === val) return;
        this.css = val;
        if (store) set({ css: this.css });
    }

    setDateStyle(val: Settings["dateStyle"], store = true) {
        if (this.dateStyle === val) return;
        this.dateStyle = val;
        if (store) set({ dateStyle: this.dateStyle });
    }
    setBackgroundRepaint() {
        this.backgroundRepaintTimer = new Date();
    }
    setFixedColors(val: string, store = true) {
        if (!hasValidColors(val)) return;
        this.fixedColors = val;
        if (store && this.isActive) {
            set({ fixedColors: val });
        }
    }
    setOrigin(val: Settings["origin"]) {
        this.origin = val;
        if (val !== "tab") this.isActive = false;
    }
    setActiveStore(id: Settings["storeId"], store = true) {
        if (this.storeId !== id) {
            this.isActive = false;
            return;
        } else {
            this.isActive = true;
            if (store && this.origin === "tab") {
                set({ lastActiveStore: this.storeId });
            }
        }
    }
    reset() {
        set({
            clockType: initial.clockType,
            colorSchema: initial.colorSchema,
            segmentLength: initial.segmentLength,
            segmentThickness: initial.segmentThickness,
            css: initial.css,
            dateStyle: initial.dateStyle,
        });
        this.isActive &&
            throttledSet({
                fixedColors: initial.fixedColors,
            });
    }
}

const hasValidColors = (s: string) => {
    if (!isValidJSON(s)) {
        return false;
    }
    const arr = JSON.parse(s);
    if (!Array.isArray(arr)) {
        return false;
    }
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

const isEqual = (a1: any[], a2: any[]) => {
    if (!Array.isArray(a1) || !Array.isArray(a2)) return false;
    if (a1.length !== a2.length) return false;
    return a1.every((i, idx) => i === a2[idx]);
};

const set = (obj: Object) => chrome.storage.sync.set(obj);
const send = (message: string) => chrome.runtime.sendMessage(message);
const throttledSet = throttled(set);

function throttled(
    fn: Function,
    throttlePeriod = initial.storageThrottlePeriod
) {
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

function suppressed(fn: Function, suppressPeriod = 1000) {
    const state = {
        t: null,
    };
    return (...args: any) => {
        if (state.t) return;
        fn(...args);
        (state.t as any) = setTimeout(() => {
            state.t = null;
        }, suppressPeriod);
    };
}

export const SettingsStore = new ExtensionSettingsStore();
