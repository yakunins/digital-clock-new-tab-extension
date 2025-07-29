import { useEffect, useState, RefObject } from "react";

const passive: AddEventListenerOptions = { passive: true };

export const useFocusWithin = (ref: RefObject<HTMLElement>): boolean => {
    const [isFocusWithin, setIsFocusWithin] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleFocusIn = (event: FocusEvent) => {
            if (el.contains(event.target as Node)) {
                setIsFocusWithin(true);
            }
        };

        const handleFocusOut = (event: FocusEvent) => {
            if (
                !event.relatedTarget ||
                !el.contains(event.relatedTarget as Node)
            ) {
                setIsFocusWithin(false);
            }
        };

        el.addEventListener("focusin", handleFocusIn, passive);
        el.addEventListener("focusout", handleFocusOut, passive);

        return () => {
            el.removeEventListener("focusin", handleFocusIn);
            el.removeEventListener("focusout", handleFocusOut);
        };
    }, []);

    return isFocusWithin;
};
