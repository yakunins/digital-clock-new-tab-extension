import { useState, useLayoutEffect } from "react";

type Pos = {
    top: number;
    left: number;
};

const mutationOptions = {
    childList: true, // Detect DOM structure changes inside the element
    subtree: true, // Detect changes in child nodes
};

export const usePosition = (ref: React.RefObject<HTMLElement>): Pos => {
    const [pos, setPos] = useState<Pos>({ top: 0, left: 0 });

    const updatePos = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const next = {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
            };

            if (pos?.top !== next.top || pos?.left !== next.left) {
                setPos(next);
            }
        }
    };

    useLayoutEffect(() => {
        const anchor = ref.current;
        if (!anchor) return;

        const resizeObserver = new ResizeObserver(updatePos);
        const mutationObserver = new MutationObserver(updatePos);

        if (ref.current) {
            resizeObserver.observe(ref.current);
            mutationObserver.observe(document.body, mutationOptions);
        }

        updatePos();
        window.addEventListener("resize", updatePos);
        window.addEventListener("scroll", updatePos);

        return () => {
            if (ref.current) {
                resizeObserver.unobserve(ref.current);
                mutationObserver.disconnect();
            }
            window.removeEventListener("resize", updatePos);
            window.removeEventListener("scroll", updatePos);
        };
    }, [ref]);

    return pos;
};
