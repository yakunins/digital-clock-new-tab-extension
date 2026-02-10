import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cx } from "../../utils";
import { Innout } from "../Innout";
import {
    useSize,
    usePosition,
    useFocusWithin,
    useOpacityTracker,
    useHasFocusable,
} from "../../hooks";

import "./tooltip.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
export type Tooltip = DivProps & {
    children: React.ReactNode;
    text: React.ReactNode;
    useClick?: boolean;
    useFocus?: boolean;
    useHover?: boolean;
    useStopMove?: boolean;
    direction?: "top" | "bottom" | "left" | "right";
    delay?: [number, number]; // [showDelay, hideDelay]
    offset?: string;
    autoFlip?: boolean;
    autoFlipDistance?: number;
};

interface TouchMouseEvent extends MouseEvent {
    sourceCapabilities?: {
        firesTouchEvents: boolean;
    };
}

export const Tooltip = ({
    children,
    text,
    useClick = false,
    useFocus = true,
    useHover = true,
    useStopMove = true, // keep hidden or shown while cursor is moving
    direction = "top",
    delay = [250, 125],
    offset = "0.1em",
    autoFlip = true,
    autoFlipDistance = 150,
    ...rest
}: Tooltip) => {
    const anchor = useRef<HTMLDivElement>(null!);
    const ship = useRef<HTMLDivElement>(null!);
    const t = useRef<ReturnType<typeof setTimeout>>(-1);

    const { width, height } = useSize(anchor);
    const { top, left } = usePosition(anchor);
    const focusWithin = useFocusWithin(anchor);
    const opacity = useOpacityTracker(anchor);
    const hasFocusable = useHasFocusable(anchor);

    const [hidden, setHidden] = useState(true);
    const [dir, setDir] = useState(direction); // effective direction based on autoFlipOffset

    useEffect(() => {
        return () => clearTimeout(t.current);
    }, []);

    const hide = (e?: Event) => {
        // ignore synthetic mouse events from touch
        if ((e as TouchMouseEvent)?.sourceCapabilities?.firesTouchEvents)
            return;
        t.current && clearTimeout(t.current);
        t.current = setTimeout(() => setHidden(true), delay[1]);
    };
    const show = (e?: Event) => {
        if ((e as TouchMouseEvent)?.sourceCapabilities?.firesTouchEvents)
            return;
        t.current && clearTimeout(t.current);
        t.current = setTimeout(() => setHidden(false), delay[0]);
    };
    const handleAutoFlip = () => {
        if (isOutside(ship, autoFlipDistance)) {
            const oppositeDirection = getReverse(direction);
            setDir(oppositeDirection);
        }
    };

    useEffect(() => {
        const c = anchor?.current;
        if (useClick) {
            c?.addEventListener("click", show);
        }
        return () => {
            c?.removeEventListener("click", show);
        };
    }, [useClick]);

    useEffect(() => {
        const a = anchor?.current;
        const s = ship?.current;
        if (useHover) {
            a?.addEventListener("mouseover", show);
            a?.addEventListener("mouseout", hide);

            s?.addEventListener("mouseover", show);
            s?.addEventListener("mouseout", hide);
        }
        return () => {
            a?.removeEventListener("mouseover", show);
            a?.removeEventListener("mouseout", hide);

            s?.removeEventListener("mouseover", show);
            s?.removeEventListener("mouseout", hide);
        };
    }, [useHover]);

    useEffect(() => {
        const a = anchor?.current;
        if (useStopMove && useHover) {
            a?.addEventListener("mousemove", show);
        }
        return () => {
            a?.removeEventListener("mousemove", show);
        };
    }, [useStopMove, useHover]);

    useEffect(() => {
        if (useFocus) focusWithin ? show() : hide();
    }, [focusWithin, useFocus]);

    useEffect(() => {
        if (anchor?.current && ship?.current)
            ship.current.style.setProperty("--width", `${width}px`);
    }, [width]);
    useEffect(() => {
        if (anchor?.current && ship?.current)
            ship.current.style.setProperty("--height", `${height}px`);
    }, [height]);
    useEffect(() => {
        if (anchor?.current && ship?.current)
            ship.current.style.setProperty("--top", `${top}px`);
    }, [top]);
    useEffect(() => {
        if (anchor?.current && ship?.current)
            ship.current.style.setProperty("--left", `${left}px`);
    }, [left]);

    useEffect(() => {
        if (anchor?.current && ship?.current)
            ship.current.style.setProperty("--offset", offset);
    }, [offset]);

    useEffect(() => {
        if (anchor?.current && ship?.current)
            ship.current.style.setProperty("--opacity", `${opacity}`);
    }, [opacity]);

    useEffect(() => {
        if (!autoFlip || hidden || !anchor?.current || !ship?.current) return;
        handleAutoFlip();
    }, [autoFlip, direction, hidden, top, left, width, height]);

    return (
        <>
            <div
                ref={anchor}
                className={cx(
                    "tooltip-anchor",
                    hidden && "hidden",
                    !hasFocusable && "focusable",
                    rest.className
                )}
                tabIndex={hasFocusable ? undefined : useFocus ? 0 : -1}
            >
                {children}
            </div>
            {createPortal(
                <div ref={ship} className="tooltip-ship">
                    <Innout out={hidden}>
                        <div
                            {...rest}
                            className={cx("tooltip", dir, rest.className)}
                        >
                            {text}
                        </div>
                    </Innout>
                </div>,
                document.body
            )}
        </>
    );
};

const getReverse = (dir: Tooltip["direction"]) => {
    switch (dir) {
        case "top":
            return "bottom";
        case "bottom":
            return "top";
        case "left":
            return "right";
        case "right":
            return "left";
        default:
            return "bottom";
    }
};

const isOutside = (ref: React.RefObject<HTMLElement>, threshold = 100) => {
    const el = ref.current;
    if (!el) return false;
    if (getMinDistanceToViewport(el) < threshold) return true;
    return false;
};

const getMinDistanceToViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();

    const distances = {
        top: rect.top,
        bottom: window.innerHeight - rect.bottom,
        left: rect.left,
        right: window.innerWidth - rect.right,
    };

    const min = Math.min(...Object.values(distances));
    return min;
};
