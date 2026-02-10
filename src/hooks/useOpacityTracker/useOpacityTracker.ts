import { useState, useEffect, useRef, useCallback } from "react";

export const useOpacityTracker = (ref: React.RefObject<HTMLElement>) => {
    const [opacity, setOpacity] = useState<number>(1);
    const lastOpacity = useRef<number>(1);

    const updateOpacity = useCallback(() => {
        const computedOpacity = getEffectiveOpacity(ref);
        if (computedOpacity !== lastOpacity.current) {
            lastOpacity.current = computedOpacity;
            setOpacity(computedOpacity);
        }
    }, [ref]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        updateOpacity();

        const observer = new MutationObserver(updateOpacity);

        // Observe style/class changes on the element and all ancestors
        let current: HTMLElement | null = element;
        while (current) {
            observer.observe(current, {
                attributes: true,
                attributeFilter: ["style", "class"],
            });
            current = current.parentElement;
        }

        return () => observer.disconnect();
    }, [ref, updateOpacity]);

    return opacity;
};

const getEffectiveOpacity = (ref: React.RefObject<HTMLElement>): number => {
    if (!ref.current) return 1;
    let opacity = 1;
    let current: null | HTMLElement = ref.current;

    while (current) {
        const computedStyle = window.getComputedStyle(current);
        opacity *= parseFloat(computedStyle.opacity);
        current = current.parentElement;
    }

    return opacity;
};
