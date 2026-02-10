import { useRef, useState, useLayoutEffect } from "react";

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
    const lastPos = useRef<Pos>({ top: 0, left: 0 });

    const updatePos = () => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const next = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
        };

        if (lastPos.current.top !== next.top || lastPos.current.left !== next.left) {
            lastPos.current = next;
            setPos(next);
        }
    };

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const resizeObserver = new ResizeObserver(updatePos);
        const mutationObserver = new MutationObserver(updatePos);

        resizeObserver.observe(el);
        mutationObserver.observe(document.body, mutationOptions);

        updatePos();
        window.addEventListener("resize", updatePos);
        window.addEventListener("scroll", updatePos);

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener("resize", updatePos);
            window.removeEventListener("scroll", updatePos);
        };
    }, [ref]);

    return pos;
};
