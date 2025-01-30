import { useState, useEffect } from "react";

type Size = {
    width: number;
    height: number;
};

export const useSize = (ref: React.RefObject<HTMLElement>): Size => {
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                const { width, height } = entry.contentRect;
                setSize({ width, height });
            }
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);

    return size;
};
