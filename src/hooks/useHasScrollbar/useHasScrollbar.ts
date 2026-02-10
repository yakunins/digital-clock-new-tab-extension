import { useEffect, useRef, useState } from "react";

type HasScrollbar = "true" | "false" | "unknown";
type MeasurementEventType = string | undefined;

type UseHasScrollbar = [HasScrollbar] | [HasScrollbar, MeasurementEventType];

const initial: HasScrollbar = "unknown";

export const useHasScrollbar = (
    ref: React.RefObject<HTMLElement>,
    axis: "y" | "x" = "y",
    dependecies: any[] = []
): UseHasScrollbar => {
    const [hasScrollbar, setHasScrollbar] = useState<HasScrollbar>(initial);
    const [eventType, setEventType] = useState<MeasurementEventType>();

    const initialResizeHandled = useRef(false);

    const checkScrollbar = (eventType?: string) => {
        if (!ref.current) {
            setHasScrollbar(initial);
            return;
        }
        const result =
            axis === "y"
                ? ref.current.scrollHeight > ref.current.clientHeight
                : ref.current.scrollWidth > ref.current.clientWidth;

        const resultStr = result ? "true" : "false";

        if (!initialResizeHandled.current && eventType === "resize") {
            initialResizeHandled.current = true;
            setHasScrollbar(resultStr);
        } else {
            setEventType(eventType);
            setHasScrollbar(resultStr);
        }
    };

    useEffect(() => {
        if (!ref.current) {
            setHasScrollbar(initial);
            return;
        }
        checkScrollbar("initial");

        const resizeObserver = new ResizeObserver(() =>
            checkScrollbar("resize")
        );
        resizeObserver.observe(ref.current);

        const mutationObserver = new MutationObserver(() =>
            checkScrollbar("mutation")
        );
        mutationObserver.observe(ref.current, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [ref, ...dependecies]);

    return [hasScrollbar, eventType];
};
