import { nanoid, customAlphabet } from "nanoid";

const lc = "abcdefghijklmnopqrstuvwxyz";
const uc = lc.toUpperCase();
export const getNanoid = (size = 4): string => nanoid(size);
export const getId = customAlphabet(lc + uc, 5);

export const getLocale = () => Intl.DateTimeFormat().resolvedOptions().locale;
export const getLocaleAmpm = () =>
    Intl.DateTimeFormat(getLocale(), { hour: "numeric" }).resolvedOptions()
        .hour12;

export const getTimezone = () =>
    Intl.DateTimeFormat().resolvedOptions().timeZone;

// output format: "Wednesday 28 September 2022"
export const getDateString = (
    locale = getLocale(),
    format: "none" | "long" | "short" = "long",
    timeZoneShift: number = 0, // minutes
    date: Date = new Date()
) => {
    const d = new Date(date);
    d.setTime(date.getTime() + timeZoneShift * 60 * 1000);
    return getLocaleString(d, locale, format);
};

// output format: "01:23 pm" or "13:23"
export const getTimeString = (
    locale = getLocale(),
    timeZoneShift: number = 0, // minutes
    date: Date = new Date()
): string => {
    const d = new Date(date);
    d.setTime(date.getTime() + timeZoneShift * 60 * 1000);
    const formatOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
    };
    return d.toLocaleTimeString(locale, formatOptions).toLowerCase();
};

export const popularLocales = [
    "en-US", // 0
    "zh-CN",
    "ru-RU",
    "fr-FR",
    "es-ES",
    "en-GB", // 5
    "de-DE",
    "pt-BR",
    "en-CA",
    "es-MX",
    "it-IT", // 10
    "ja-JP",
    "bn-IN",
    "da-DK",
    "th-TH",
    "ar-EG", // 15
];

type State = {
    t: null | number;
    collectedArgs: any[];
};

export function debouncedCallback(fn: Function, debouncePeriod = 100) {
    const state: State = {
        t: null,
        collectedArgs: [],
    };
    return (...args: any) => {
        if (state.t) {
            clearTimeout(state.t); // cancel scheduled execution
        }
        state.collectedArgs = mergeArgs(state.collectedArgs, args);
        (state.t as any) = setTimeout(() => {
            fn(...state.collectedArgs);
            state.t = null;
            state.collectedArgs = [];
        }, debouncePeriod);
    };
}

const digits = /^\d+$/;
export const parseDigits = (str: string): string | number =>
    digits.test(str) ? parseInt(str, 10) : str;

const mergeArgs = (prev: any[], next: any[]): any[] => {
    const res: any[] = [];
    next.forEach((i, idx) => {
        res.push(sumObj(prev[idx], i));
    });
    return res;
};

const sumObj = (o1: unknown, o2: unknown) => {
    const t1 = typeof o1;
    const t2 = typeof o2;
    if (t1 !== t2) return o2;

    // null
    if (o2 === null) return o2;

    // undefined
    if (t1 === "undefined") return o2;
    if (t2 === "undefined") return o2;

    // primitives
    if (["number", "string", "boolean"].includes(t1)) {
        return (o1 as any) + o2;
    }

    // array merge
    if (Array.isArray(t1) && Array.isArray(t2)) {
        return [o1, o2].flat();
    }

    // object merge
    if (
        (o1 as Object).constructor.name === "Object" &&
        (o2 as Object).constructor.name === "Object"
    ) {
        return { ...(o1 as Object), ...(o2 as Object) };
    }

    return o2;
};

export const getLocaleString = (
    date = new Date(),
    locale = getLocale(),
    format: "none" | "long" | "short" = "long"
): string => {
    if (format === "none") return date.toLocaleString(locale);

    const localeString = date.toLocaleString(locale, {
        weekday: format,
        day: "numeric",
        month: format,
    });
    return localeString;
};
