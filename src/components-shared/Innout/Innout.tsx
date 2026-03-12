import React, { useRef, CSSProperties } from "react";

import { cx } from "../../utils";
import { useStepAnimation, AnimationStep } from "../../hooks";
import "./innout.css";

type Step = {
    duration: number;
    name?: string;
};
type Steps = Step[];

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type Innout = DivProps & {
    out: boolean;
    classNameSteps?: Steps;
    minStepDuration?: number;
    scrollIntoView?: boolean;
};

const defaultSteps: Steps = [
    { duration: 1, name: "mounted" },
    { duration: 350, name: "step" },
    { duration: 1, name: "finished" },
];

export const Innout = ({
    out,
    classNameSteps = defaultSteps,
    minStepDuration = 25,
    scrollIntoView = false,
    ...rest
}: Innout) => {
    const wrapperElement = useRef<HTMLDivElement>(null!);

    const animSteps: AnimationStep[] = classNameSteps.map((s) => ({
        label: s.name ?? "",
        duration: s.duration,
    }));

    const lastIndex = animSteps.length; // +1 because hook prepends unmounted
    const targetStep = out ? 0 : lastIndex;

    const { currentLabel, isAnimating, direction, durationStyles, isMounted } =
        useStepAnimation({
            targetStep,
            steps: animSteps,
            minStepDuration,
            scrollIntoView,
            elementRef: wrapperElement,
        });

    if (!isMounted) return null;

    const dir = direction === "forward" ? "in" : direction === "backward" ? "out" : out ? "out" : "in";
    const stepClassName = cx(
        currentLabel,
        isAnimating && `animation ${dir}`
    );

    const styles = {
        ...durationStyles,
        ...rest.style,
    } as CSSProperties;

    return (
        <div
            {...rest}
            className={cx("innout", rest.className, stepClassName)}
            style={styles}
            ref={wrapperElement}
            aria-hidden={out || undefined}
        />
    );
};
