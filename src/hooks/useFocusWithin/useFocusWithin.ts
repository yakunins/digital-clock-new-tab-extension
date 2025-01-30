import { useEffect, useState, RefObject } from "react";

export const useFocusWithin = (ref: RefObject<HTMLElement>): boolean => {
    const [isFocusWithin, setIsFocusWithin] = useState(false);

    useEffect(() => {
        const element = ref.current;

        const handleFocusIn = (event: FocusEvent) => {
            if (element && element.contains(event.target as Node)) {
                setIsFocusWithin(true);
            }
        };

        const handleFocusOut = (event: FocusEvent) => {
            if (element && !element.contains(event.relatedTarget as Node)) {
                setIsFocusWithin(false);
            }
        };

        if (element) {
            element.addEventListener("focusin", handleFocusIn);
            element.addEventListener("focusout", handleFocusOut);
        }

        return () => {
            if (element) {
                element.removeEventListener("focusin", handleFocusIn);
                element.removeEventListener("focusout", handleFocusOut);
            }
        };
    }, [ref]);

    return isFocusWithin;
};
