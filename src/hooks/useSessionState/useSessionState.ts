import { useState, useEffect } from "react";

export function useSessionState(
    key: string | null,
    initialValue: boolean | number | string
) {
    const [storedValue, setStoredValue] = useState(() => {
        if (key === null) return initialValue;
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(error);
            return initialValue;
        }
    });

    useEffect(() => {
        if (key === null) return;
        try {
            window.sessionStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}
