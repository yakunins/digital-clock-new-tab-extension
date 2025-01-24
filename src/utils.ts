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

// format: "Wednesday 28 September 2022"
export const getDateString = (
    date = new Date(),
    locale = getLocale()
): string => {
    const now = date || new Date();
    const weekday = now.toLocaleString(locale, { weekday: "long" });
    const day = now.toLocaleString(locale, { day: "numeric" });
    const month = now.toLocaleString(locale, { month: "long" });
    const year = now.toLocaleString(locale, { year: "numeric" });
    return `${weekday} ${day} ${month} ${year}`;
};

// format: "01:23 pm" or "13:23"
export const getTimeString = (locale = getLocale()): string => {
    const now = new Date();
    const formatOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
    };
    return now.toLocaleTimeString(locale, formatOptions).toLowerCase();
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

export function throttledCallback(fn: Function, throttlePeriod = 250) {
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
export const parseDigits = (str: string): string | number =>
    digits.test(str) ? parseInt(str, 10) : str;
