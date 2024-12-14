type StorageObject<V> = {
    [key: string]: V;
};
const get = async <V>(obj: StorageObject<V>): Promise<V> => {
    const [key, defaultValue] = Object.entries(obj)[0];
    let result = defaultValue;
    if (chrome?.storage?.sync?.get!) {
        const items = await chromeStorageGet<V>(key);
        result = items[key] !== undefined ? items[key] : defaultValue;
        return result;
    } else {
        const storedValue = localStorage.getItem(key);
        result =
            storedValue !== null
                ? (parseDigits(storedValue) as V)
                : defaultValue;
        return result;
    }
};

function chromeStorageGet<T>(
    keys: string | string[] | { [key: string]: any }
): Promise<{ [key: string]: T }> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });
}

const send = (message: string) => chrome.runtime.sendMessage(message);
const set = async (obj: StorageObject<string | number>) => {
    if (chrome?.storage?.sync?.set) {
        return await chrome.storage.sync.set(obj);
    } else {
        for (let k in obj) {
            const v = obj[k];
            localStorage.setItem(k, v.toString());
        }
        return;
    }
};

function throttledCallback(fn: Function, throttlePeriod = 500) {
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

const digits = /^\d+$/;
const parseDigits = (str: string): string | number =>
    digits.test(str) ? parseInt(str, 10) : str;

export const storage = {
    get: get,
    set: set,
    throttledSet: throttledCallback(set),
};
