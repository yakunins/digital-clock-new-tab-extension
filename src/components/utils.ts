import { nanoid } from "nanoid";

export const getId = (size = 4): string => nanoid(size);

export const getLocale = () => Intl.DateTimeFormat().resolvedOptions().locale;
export const getLocaleAmpm = () =>
    Intl.DateTimeFormat(getLocale(), { hour: "numeric" }).resolvedOptions()
        .hour12;

export const getTimezone = () =>
    Intl.DateTimeFormat().resolvedOptions().timeZone;

// format: "Wednesday 28 September 2022"
export const getDateString = (
    locale = getLocale(),
    date = new Date()
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
