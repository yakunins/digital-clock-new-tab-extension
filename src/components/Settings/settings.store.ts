import { makeObservable, observable, computed, action } from "mobx";
import { getLocaleAmpm } from "../utils";
import { randomHexColors } from "../BackgroundFill/random-color";

type Settings = {
    ampm: "24-hour" | "ampm";
    colorSchema: "random" | "fixed";
    fixedColors: string;
    status?: string;
};
export type SettingsStore = Settings & {
    setAmpm: (val: Settings["ampm"]) => void;
    setFixedColors: (val: Settings["fixedColors"]) => void;
    setColorSchema: (val: Settings["colorSchema"]) => void;
    reset: () => void;
};

const defaults: Settings = {
    ampm: getLocaleAmpm() ? "ampm" : "24-hour",
    colorSchema: "random",
    fixedColors: JSON.stringify(["#fff", "#eee", "#555", "#000"]),
};

class ExtensionSettingsStore implements SettingsStore {
    ampm = defaults.ampm!;
    colorSchema = defaults.colorSchema!;
    fixedColors = defaults.fixedColors!;

    constructor() {
        makeObservable(this, {
            ampm: observable,
            colorSchema: observable,
            fixedColors: observable,
            status: computed,
            setAmpm: action,
            setFixedColors: action,
            setColorSchema: action,
            reset: action,
        });
        chrome.storage.sync.get(
            {
                ampm: defaults.ampm!,
                colorSchema: defaults.colorSchema!,
                fixedColors: defaults.fixedColors!,
            },
            (items) => {
                this.setAmpm(items.ampm);
                this.setColorSchema(items.colorSchema);
                if (this.colorSchema === "random")
                    this.setFixedColors(JSON.stringify(randomHexColors())); // construct with random colors
                if (this.colorSchema === "fixed")
                    this.setFixedColors(items.fixedColors);
            }
        );
        chrome.storage.onChanged.addListener((changes, namespace) => {
            // namespace=sync
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (key === "ampm") this.setAmpm(newValue);
                if (key === "colorSchema") this.setColorSchema(newValue);
                if (key === "fixedColors") this.setFixedColors(newValue);
            }
        });
    }

    get status() {
        const status = `ampm: ${this.ampm}, fixedColors: ${this.fixedColors}, colorSchema: ${this.colorSchema}`;
        return status;
    }

    setAmpm(val: Settings["ampm"]) {
        if (this.ampm === val) return;
        this.ampm = val;
        chrome.storage.sync.set({ ampm: this.ampm });
    }

    setColorSchema(val: Settings["colorSchema"]) {
        if (this.colorSchema === val) return;
        this.colorSchema = val;
        chrome.storage.sync.set({ colorSchema: this.colorSchema });
        if (val === "fixed") {
            const sessionStorageItem =
                "digital_clock_newtab_extension_current_colors";
            const fixedColors = sessionStorage.getItem(sessionStorageItem);
            if (fixedColors) {
                this.setFixedColors(fixedColors as Settings["fixedColors"]);
            }
        }
    }

    setFixedColors(val: Settings["fixedColors"]) {
        if (this.fixedColors === val) return;
        this.fixedColors = val;
        chrome.storage.sync.set({ fixedColors: this.fixedColors });
    }

    reset() {
        this.setAmpm(defaults.ampm!);
        this.setColorSchema(defaults.colorSchema!);
        this.setFixedColors(defaults.fixedColors!);
    }
}

export const SettingsStore = new ExtensionSettingsStore();
