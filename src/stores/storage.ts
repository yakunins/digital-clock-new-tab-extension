import { debouncedCallback, parseDigits } from "../utils";

declare const browser: typeof chrome;
type StorageObject<V> = {
    [key: string]: V;
};

export const storageName = (() => {
    if (typeof chrome !== "undefined") {
        if (
            typeof chrome.storage !== "undefined" &&
            typeof chrome.storage.sync !== "undefined"
        )
            return "chrome.storage"; // chrome/edge extension
    }
    if (typeof browser !== "undefined") {
        if (
            typeof browser.storage !== "undefined" &&
            typeof browser.storage.sync !== "undefined"
        )
            return "browser.storage"; // firefox/safari extension
    }
    return "localStorage"; // web page
})();

const get = async <V>(obj: StorageObject<V>): Promise<V> => {
    const [key, defaultValue] = Object.entries(obj)[0];
    let result = defaultValue;

    // chrome, edge
    if (storageName === "chrome.storage") {
        const items = await chromeStorageGet<V>(key);
        result = items[key] !== undefined ? items[key] : defaultValue;
        return result;
    }

    // firefox, safari
    if (storageName === "browser.storage") {
        const items = await browserStorageGet<V>(key);
        result = items[key] !== undefined ? items[key] : defaultValue;
        return result;
    }

    // storageName === "localStorage"
    const storedValue = localStorage.getItem(key);
    result =
        storedValue !== null ? (parseDigits(storedValue) as V) : defaultValue;
    return result;
};

function chromeStorageGet<T>(
    keys: string | string[] | { [key: string]: any }
): Promise<{ [key: string]: T }> {
    return new Promise((resolve, reject) => {
        chrome?.storage?.sync.get(keys, (result) => {
            if (chrome?.runtime?.lastError) {
                reject(chrome?.runtime?.lastError);
            } else {
                resolve(result);
            }
        });
    });
}
function browserStorageGet<T>(
    keys: string | string[] | { [key: string]: any }
): Promise<{ [key: string]: T }> {
    return new Promise((resolve, reject) => {
        browser?.storage?.sync.get(keys, (result) => {
            if (chrome?.runtime?.lastError) {
                reject(chrome?.runtime?.lastError);
            } else {
                resolve(result);
            }
        });
    });
}

const send = (message: string) => chrome?.runtime?.sendMessage(message);
const set = async (obj: StorageObject<string | number | boolean>) => {
    if (storageName === "chrome.storage") {
        return await chrome.storage.sync.set(obj); // chrome, edge
    }

    if (storageName === "browser.storage") {
        return await browser.storage.sync.set(obj); // firefox, safari
    }

    if (storageName === "localStorage") {
        for (let k in obj) {
            const v = obj[k];
            localStorage.setItem(k, v.toString()); // web page
        }
        return;
    }
};

export type Changes = {
    [key: string]: chrome.storage.StorageChange;
};
export type Namespace = chrome.storage.AreaName;
export type StorageChangeHandler = (
    changes: Changes,
    namespace: Namespace
) => void;

function addListener(callback: StorageChangeHandler) {
    if (storageName === "chrome.storage") {
        chrome.storage.onChanged.addListener(callback);
        return;
    }

    if (storageName === "browser.storage") {
        browser.storage.onChanged.addListener(callback);
        return;
    }

    if (storageName === "localStorage") {
        function storageEventListener(e: StorageEvent) {
            if (e.key) {
                const changes = {
                    [e.key]: { newValue: e.newValue, oldValue: e.oldValue },
                };
                callback(changes, "local");
            }
        }
        window.addEventListener("storage", storageEventListener);
    }
}

export const storage = (debouncePeriod = 100) => {
    return {
        get,
        set,
        addListener,
        debouncedSet: debouncedCallback(set, debouncePeriod),
    };
};
