import { makeObservable, observable, computed, action } from 'mobx';
import { getLocaleAmpm } from '../utils';
import { getId } from '../utils';

import {
    storage as getStorage,
    StorageChangeHandler,
    Changes,
    Namespace,
} from './storage';

type Settings = {
    clockType: '24-hour' | 'ampm';
    clockLeadingZero: boolean;
    colorSchema: 'sky' | 'random' | 'fixed';
    css: string;
    dateStyle: 'long' | 'short' | 'none';
    favicon: string;
    fixedColors: string;
    segmentLength: number;
    segmentThickness: number;
    segmentShape: 'diamond' | 'natural' | 'rect' | 'pill' | 'calculator';
    status?: string;
    timeShift: number;
    storeId: string; // multiple stores handling
    origin: 'unknown' | 'tab' | 'popup' | 'options';
    isActive: boolean; // store belongs to last active tab
};

export type SettingsStore = Settings & {
    handleStorageChange: StorageChangeHandler;
    setClockType: (val: Settings['clockType']) => void;
    setClockLeadingZero: (val: Settings['clockLeadingZero']) => void;
    setColorSchema: (val: Settings['colorSchema']) => void;
    setCss: (val: Settings['css']) => void;
    setDateStyle: (val: Settings['dateStyle']) => void;
    setLength: (val: Settings['segmentLength']) => void;
    setThickness: (val: Settings['segmentThickness']) => void;
    setShape: (val: Settings['segmentShape']) => void;
    setTimeShift: (minutes: Settings['timeShift']) => void;
    updateSkyBackground: () => void;
    reset: () => void;
};

const config = {
    skyUpdatePeriod: 5000, // update period of natural sky background
    storageDebouncePeriod: 250,
};
const initialCss = `:root {
    --color: rgba(198, 255, 240, 1);
    --bg-color: black;
    --bg-opacity: 0;
  }
  .clock {
    --glow-size: 3em;
    --glow-opacity: 100%;
    --clock-frame-opacity: 0;
  }`;
const initial: Settings = {
    clockType: getLocaleAmpm() ? 'ampm' : '24-hour',
    clockLeadingZero: true,
    colorSchema: 'sky',
    css: initialCss,
    fixedColors: JSON.stringify(['#ffe8de', '#6e7cca', '#860d0e', '#21022a']),
    dateStyle: 'long',
    favicon: 'browser_default',
    segmentLength: 30,
    segmentThickness: 40,
    segmentShape: 'diamond',
    timeShift: 0,

    storeId: getId(),
    origin: 'unknown',
    isActive: true,
};
const reset: Partial<Settings> = {
    clockType: initial.clockType,
    clockLeadingZero: initial.clockLeadingZero,
    colorSchema: initial.colorSchema,
    css: initial.css,
    dateStyle: initial.dateStyle,
    favicon: initial.favicon,
    segmentLength: initial.segmentLength,
    segmentShape: initial.segmentShape,
    segmentThickness: initial.segmentThickness,
    timeShift: initial.timeShift,
};

class ExtensionSettingsStore implements SettingsStore {
    clockType = initial.clockType;
    clockLeadingZero = initial.clockLeadingZero;
    colorSchema = initial.colorSchema;
    css = initial.css;
    dateStyle = initial.dateStyle;
    fixedColors = initial.fixedColors;
    favicon = initial.favicon;
    segmentLength = initial.segmentLength;
    segmentThickness = initial.segmentThickness;
    segmentShape = initial.segmentShape;
    timeShift = initial.timeShift;
    skyBackgroundTime = new Date();

    storeId = initial.storeId; // handling different SettingsStores per newtab.html, popup.html and options.html
    origin = initial.origin;
    isActive = initial.isActive;

    storage = getStorage(config.storageDebouncePeriod);

    constructor() {
        makeObservable(this, {
            skyBackgroundTime: observable,
            clockType: observable,
            clockLeadingZero: observable,
            colorSchema: observable,
            css: observable,
            dateStyle: observable,
            fixedColors: observable,
            favicon: observable,
            hasChanges: computed,
            segmentLength: observable,
            segmentThickness: observable,
            segmentShape: observable,
            timeShift: observable,
            updateSkyBackground: action,
            setClockType: action,
            setClockLeadingZero: action,
            setColorSchema: action,
            setCss: action,
            setDateStyle: action,
            setFixedColors: action,
            setFavicon: action,
            setLength: action,
            setThickness: action,
            setShape: action,
            setTimeShift: action,
            status: computed,
            reset: action,
        });

        setInterval(() => {
            this.updateSkyBackground();
        }, config.skyUpdatePeriod);

        this.storage
            .get({ clockType: this.clockType })
            .then((res) => this.setClockType(res, false));
        this.storage
            .get({ clockLeadingZero: this.clockLeadingZero })
            .then((res) => this.setClockLeadingZero(res, false));
        this.storage
            .get({ colorSchema: this.colorSchema })
            .then((res) => this.setColorSchema(res, false));
        this.storage
            .get({ css: this.css })
            .then((res) => this.setCss(res, false));
        this.storage
            .get({ dateStyle: this.dateStyle })
            .then((res) => this.setDateStyle(res, false));
        this.storage
            .get({ favicon: this.favicon })
            .then((res) => this.setFavicon(res, false));
        this.storage
            .get({ fixedColors: this.fixedColors })
            .then((res) => this.setFixedColors(res, false));
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
            .get({ timeShift: this.timeShift })
            .then((res) => this.setTimeShift(res, false));

        // listen for changes from other tabs
        this.storage.addListener(this.handleStorageChange.bind(this));
    }

    get status(): string {
        const status = `
            skyBackgroundTime: ${this.skyBackgroundTime},
            clockType: ${this.clockType},
            clockLeadingZero: ${this.clockLeadingZero},
            colorSchema: ${this.colorSchema},
            css: ${this.css},
            dateStyle: ${this.dateStyle},
            favicon: ${this.favicon}
            fixedColors: ${this.fixedColors}
            segmentLength: ${this.segmentLength},
            segmentShape: ${this.segmentShape},
            segmentThickness: ${this.segmentThickness},
            timeShift: ${this.timeShift},            
            origin: ${this.origin}
        `;
        return status;
    }

    get hasChanges(): boolean {
        return Object.keys(reset).some((k) => {
            const res = (this as any)[k] !== (reset as any)[k];
            return res;
        });
    }

    handleStorageChange(changes: Changes, namespace: Namespace) {
        // Process colorSchema first so dependent guards (e.g. fixedColors) see the updated value
        if (changes.colorSchema) {
            const { oldValue, newValue } = changes.colorSchema;
            if (oldValue !== newValue)
                this.setColorSchema(newValue as any, false);
        }

        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (oldValue === newValue) continue;
            if (key === 'colorSchema') continue; // already handled above
            const val = newValue as any;

            if (key === 'lastActiveStore') this.setActiveStore(val, false);
            if (key === 'clockType') this.setClockType(val, false);
            if (key === 'clockLeadingZero')
                this.setClockLeadingZero(val, false);
            if (key === 'css') this.setCss(val, false);
            if (key === 'dateStyle') this.setDateStyle(val, false);
            if (key === 'fixedColors' && this.colorSchema !== 'random')
                this.setFixedColors(val, false);
            if (key === 'favicon') this.setFavicon(val, false);
            if (key === 'segmentLength') this.setLength(val, false);
            if (key === 'segmentShape') this.setShape(val, false);
            if (key === 'segmentThickness') this.setThickness(val, false);
            if (key === 'timeShift') this.setTimeShift(val, false);
        }
    }

    setClockType(val: Settings['clockType'], useStorage = true) {
        if (this.clockType === val) return;
        this.clockType = val;
        if (useStorage)
            this.storage.debouncedSet({ clockType: this.clockType });
    }

    setClockLeadingZero(val: Settings['clockLeadingZero'], useStorage = true) {
        const v = toBoolean(val);
        if (this.clockLeadingZero === v) return;
        this.clockLeadingZero = v;
        if (useStorage)
            this.storage.debouncedSet({
                clockLeadingZero: this.clockLeadingZero,
            });
    }

    setColorSchema(val: Settings['colorSchema'], useStorage = true) {
        if (this.colorSchema === val) return;
        const wasRandom = this.colorSchema === 'random';
        this.colorSchema = val;
        if (useStorage) {
            if (wasRandom) {
                // Leaving "random": sync both schema and current colors atomically
                this.storage.debouncedSet({
                    colorSchema: this.colorSchema,
                    fixedColors: this.fixedColors,
                });
            } else {
                this.storage.debouncedSet({ colorSchema: this.colorSchema });
            }
        }
    }

    setLength(val: Settings['segmentLength'], useStorage = true) {
        if (this.segmentLength === val) return;
        val <= 100 && val >= 10
            ? (this.segmentLength = val)
            : (this.segmentLength = initial.segmentLength);
        if (useStorage)
            this.storage.debouncedSet({ segmentLength: this.segmentLength });
    }

    setThickness(val: Settings['segmentThickness'], useStorage = true) {
        if (this.segmentThickness === val) return;

        val <= 100 && val >= 10
            ? (this.segmentThickness = val)
            : (this.segmentThickness = initial.segmentThickness);
        if (useStorage)
            this.storage.debouncedSet({
                segmentThickness: this.segmentThickness,
            });
    }

    setShape(val: Settings['segmentShape'], useStorage = true) {
        if (this.segmentShape === val) return;
        this.segmentShape = val;
        if (useStorage)
            this.storage.debouncedSet({ segmentShape: this.segmentShape });
    }

    setFavicon(val: Settings['favicon'], useStorage = true) {
        if (this.favicon === val) return;
        this.favicon = val;
        if (useStorage) this.storage.debouncedSet({ favicon: this.favicon });
    }

    setCss(val: Settings['css'], useStorage = true) {
        if (this.css === val) return;
        this.css = val;
        if (useStorage) this.storage.debouncedSet({ css: this.css });
    }

    setDateStyle(val: Settings['dateStyle'], useStorage = true) {
        if (this.dateStyle === val) return;
        this.dateStyle = val;
        if (useStorage)
            this.storage.debouncedSet({ dateStyle: this.dateStyle });
    }

    setTimeShift(val: Settings['timeShift'], useStorage = true) {
        if (this.timeShift === val) return;
        this.timeShift = val;
        this.updateSkyBackground();
        if (useStorage)
            this.storage.debouncedSet({ timeShift: this.timeShift });
    }

    setFixedColors(val: string, useStorage = true) {
        if (!hasValidColors(val)) return;
        if (this.fixedColors === val) return;
        this.fixedColors = val;
        if (useStorage && this.isActive) {
            this.storage.debouncedSet({ fixedColors: val });
        }
    }

    setOrigin(val: Settings['origin']) {
        this.origin = val;
        if (val !== 'tab') this.isActive = false;
    }

    setActiveStore(id: Settings['storeId'], useStorage = true) {
        if (this.storeId !== id) {
            this.isActive = false;
            return;
        } else {
            this.isActive = true;
            if (useStorage && this.origin === 'tab') {
                this.storage.set({ lastActiveStore: this.storeId });
            }
        }
    }

    updateSkyBackground() {
        const now = new Date();
        now.setTime(now.getTime() + this.timeShift * 60 * 1000);
        this.skyBackgroundTime = now;
    }

    reset() {
        for (const k in reset) {
            (this as any)[k] = (reset as any)[k];
        }
        this.storage.set(reset);
        this.updateSkyBackground();
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

const toBoolean = (val: boolean | undefined | 'true' | 'false') => {
    switch (val) {
        case false:
        case 'false':
            return false;
        case true:
        case 'true':
            return true;
        default:
            return false;
    }
};

export const SettingsStore = new ExtensionSettingsStore();
