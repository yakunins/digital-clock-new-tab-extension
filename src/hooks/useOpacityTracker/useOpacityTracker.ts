import { useState, useEffect, useRef } from "react";

export const useOpacityTracker = (ref: React.RefObject<HTMLElement>) => {
    const [opacity, setOpacity] = useState<number>(1);
    const animationFrameRef = useRef<number>(null!);

    useEffect(() => {
        const element = ref.current;

        if (!element) return;

        const updateOpacity = () => {
            const computedOpacity = getEffectiveOpacity(ref);
            setOpacity(computedOpacity);
            animationFrameRef.current = requestAnimationFrame(updateOpacity);
        };

        animationFrameRef.current = requestAnimationFrame(updateOpacity);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [ref]);

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
