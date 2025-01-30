import { useEffect, useState } from "react";

export function useHasFocusable(ref: React.RefObject<HTMLElement>): boolean {
    const [hasFocusable, setHasFocusable] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const focusableSelectors = [
            "a[href]",
            "button",
            "input",
            "textarea",
            "select",
            "details",
            "[tabindex]:not([tabindex='-1'])",
        ];

        const checkFocusable = () => {
            const focusableElements = ref.current?.querySelectorAll(
                focusableSelectors.join(",")
            );
            focusableElements && focusableElements.length > 0
                ? setHasFocusable(true)
                : setHasFocusable(false);
        };

        const observer = new MutationObserver(checkFocusable);
        observer.observe(ref.current, { childList: true, subtree: true });

        checkFocusable();

        return () => observer.disconnect();
    }, [ref]);

    return hasFocusable;
}
