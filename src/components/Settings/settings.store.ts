import { makeObservable, observable, computed, action } from "mobx";
import { getLocaleAmpm } from "../../utils";
import { getId } from "../../utils";

import {
    storage as getStorage,
    StorageChangeHandler,
    Changes,
    Namespace,
} from "./storage";

type Settings = {
    clockType: "24-hour" | "ampm";
    colorSchema: "sky" | "random" | "fixed";
    fixedColors: string;
    css: string;
    dateStyle: "long" | "short" | "none";
    segmentLength: number;
    segmentThickness: number;
    segmentShape: "diamond" | "natural" | "rect" | "pill";
    status?: string;

    storeId: string; // multiple stores handling
    origin: "unknown" | "tab" | "popup" | "options";
    isActive: boolean; // store belongs to last active tab
};

export type SettingsStore = Settings & {
    handleStorageChange: StorageChangeHandler;
    setClockType: (val: Settings["clockType"]) => void;
    setColorSchema: (val: Settings["colorSchema"]) => void;
    setCss: (val: Settings["css"]) => void;
    setDateStyle: (val: Settings["dateStyle"]) => void;
    setLength: (val: Settings["segmentLength"]) => void;
    setThickness: (val: Settings["segmentThickness"]) => void;
    setShape: (val: Settings["segmentShape"]) => void;
    setBackgroundRepaint: () => void;
    reset: () => void;
};

const config = {
    skyBackgroundRepaintPeriod: 30 * 1000, // update each 30 seconds
    storageDebouncePeriod: 250,
};
const initialCss = `:root {
    --color: rgba(168, 255, 236, 1);
    --bg-color: black;
    --bg-opacity: 0;
  }
  .clock {
    --glow-size: 3em;
    --glow-opacity: 100%;
    --clock-frame-opacity: 0;
  }`;
const initial: Settings = {
    clockType: getLocaleAmpm() ? "ampm" : "24-hour",
    colorSchema: "sky",
    css: initialCss,
    fixedColors: JSON.stringify(["#ffe8de", "#6e7cca", "#860d0e", "#21022a"]),
    dateStyle: "long",
    segmentLength: 30,
    segmentThickness: 40,
    segmentShape: "diamond",

    storeId: getId(),
    origin: "unknown",
    isActive: true,
};
const reset: Partial<Settings> = {
    colorSchema: initial.colorSchema,
    clockType: initial.clockType,
    css: initial.css,
    dateStyle: initial.dateStyle,
    segmentLength: initial.segmentLength,
    segmentShape: initial.segmentShape,
    segmentThickness: initial.segmentThickness,
};

class ExtensionSettingsStore implements SettingsStore {
    clockType = initial.clockType;
    colorSchema = initial.colorSchema;
    css = initial.css;
    dateStyle = initial.dateStyle;
    fixedColors = initial.fixedColors;
    segmentLength = initial.segmentLength;
    segmentThickness = initial.segmentThickness;
    segmentShape = initial.segmentShape;
    skyBackgroundRepaintTimer = new Date();

    storeId = initial.storeId; // handling different SettingsStores per newtab.html, popup.html and options.html
    origin = initial.origin;
    isActive = initial.isActive;

    storage = getStorage(config.storageDebouncePeriod);

    constructor() {
        makeObservable(this, {
            skyBackgroundRepaintTimer: observable,
            clockType: observable,
            colorSchema: observable,
            css: observable,
            dateStyle: observable,
            hasChanges: computed,
            segmentLength: observable,
            segmentThickness: observable,
            segmentShape: observable,
            setBackgroundRepaint: action,
            setClockType: action,
            setColorSchema: action,
            setCss: action,
            setDateStyle: action,
            setFixedColors: action,
            setLength: action,
            setThickness: action,
            setShape: action,
            status: computed,
            reset: action,
        });

        setInterval(() => {
            this.setBackgroundRepaint();
        }, config.skyBackgroundRepaintPeriod);

        this.storage
            .get({ clockType: this.clockType })
            .then((res) => this.setClockType(res, false));
        this.storage
            .get({ colorSchema: this.colorSchema })
            .then((res) => this.setColorSchema(res, false));
        this.storage
            .get({ segmentLength: this.segmentLength })
            .then((res) => this.setLength(res, false));
        this.storage
            .get({ segmentThickness: this.segmentThickness })
            .then((res) => this.setThickness(res, false));
        this.storage
            .get({ segmentShape: this.segmentShape })
            .then((res) => this.setShape(res, false));
        this.storage
            .get({ css: this.css })
            .then((res) => this.setCss(res, false));
        this.storage
            .get({ dateStyle: this.dateStyle })
            .then((res) => this.setDateStyle(res, false));
        this.storage
            .get({ fixedColors: this.fixedColors })
            .then((res) => this.setFixedColors(res, false));

        this.storage.addListener(this.handleStorageChange.bind(this));
    }

    get status(): string {
        const status = `
            backgroundRepaintTimer: ${this.skyBackgroundRepaintTimer},
            clockType: ${this.clockType},
            colorSchema: ${this.colorSchema},
            dateStyle: ${this.dateStyle},
            segmentLength: ${this.segmentLength},
            segmentShape: ${this.segmentShape},
            segmentThickness: ${this.segmentThickness},
            fixedColors: ${this.fixedColors}
            origin: ${this.origin}
        `;
        return status;
    }

    get hasChanges(): boolean {
        return Object.keys(reset).some(
            (k) => (this as any)[k] !== (reset as any)[k]
        );
    }

    handleStorageChange(changes: Changes, namespace: Namespace) {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (oldValue === newValue) return;
            if (key === "lastActiveStore") this.setActiveStore(newValue, false);
            if (key === "clockType") this.setClockType(newValue, false);
            if (key === "colorSchema") this.setColorSchema(newValue, false);
            if (key === "css") this.setCss(newValue, false);
            if (key === "dateStyle") this.setDateStyle(newValue, false);
            if (key === "fixedColors") this.setFixedColors(newValue, false);
            if (key === "segmentLength") this.setLength(newValue, false);
            if (key === "segmentShape") this.setShape(newValue, false);
            if (key === "segmentThickness") this.setThickness(newValue, false);
        }
    }

    setClockType(val: Settings["clockType"], useStorage = true) {
        if (this.clockType === val) return;
        this.clockType = val;
        if (useStorage)
            this.storage.throttledSet({ clockType: this.clockType });
    }

    setColorSchema(val: Settings["colorSchema"], useStorage = true) {
        if (this.colorSchema === val) return;
        this.colorSchema = val;
        if (useStorage) this.storage.set({ colorSchema: this.colorSchema });
    }

    setLength(val: Settings["segmentLength"], useStorage = true) {
        if (this.segmentLength === val) return;
        val <= 100 && val >= 10
            ? (this.segmentLength = val)
            : (this.segmentLength = initial.segmentLength);
        if (useStorage)
            this.storage.throttledSet({ segmentLength: this.segmentLength });
    }

    setThickness(val: Settings["segmentThickness"], useStorage = true) {
        if (this.segmentThickness === val) return;

        val <= 100 && val >= 10
            ? (this.segmentThickness = val)
            : (this.segmentThickness = initial.segmentThickness);
        if (useStorage)
            this.storage.throttledSet({
                segmentThickness: this.segmentThickness,
            });
    }

    setShape(val: Settings["segmentShape"], useStorage = true) {
        if (this.segmentShape === val) return;
        this.segmentShape = val;
        if (useStorage)
            this.storage.throttledSet({ segmentShape: this.segmentShape });
    }

    setCss(val: Settings["css"], useStorage = true) {
        if (this.css === val) return;
        this.css = val;
        if (useStorage) this.storage.throttledSet({ css: this.css });
    }

    setDateStyle(val: Settings["dateStyle"], useStorage = true) {
        if (this.dateStyle === val) return;
        this.dateStyle = val;
        if (useStorage)
            this.storage.throttledSet({ dateStyle: this.dateStyle });
    }
    setBackgroundRepaint() {
        this.skyBackgroundRepaintTimer = new Date();
    }
    setFixedColors(val: string, useStorage = true) {
        if (!hasValidColors(val)) return;
        this.fixedColors = val;
        if (useStorage && this.isActive) {
            this.storage.throttledSet({ fixedColors: val });
        }
    }
    setOrigin(val: Settings["origin"]) {
        this.origin = val;
        if (val !== "tab") this.isActive = false;
    }
    setActiveStore(id: Settings["storeId"], useStorage = true) {
        if (this.storeId !== id) {
            this.isActive = false;
            return;
        } else {
            this.isActive = true;
            if (useStorage && this.origin === "tab") {
                this.storage.set({ lastActiveStore: this.storeId });
            }
        }
    }
    reset() {
        for (const k in reset) {
            (this as any)[k] = (reset as any)[k];
        }
        this.storage.set(reset);
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

export const SettingsStore = new ExtensionSettingsStore();
