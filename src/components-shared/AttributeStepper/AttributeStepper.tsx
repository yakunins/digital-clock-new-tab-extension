import React, { useRef, CSSProperties } from "react";

import { cx } from "../../utils";
import { useStepAnimation, AnimationStep } from "../../hooks";
import "./attribute-stepper.css";

type Step = {
    duration?: number;
    value: string;
};
type Steps = Step[];

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type AttributeStepper = DivProps & {
    attribute?: string;
    step: number | "first" | "last";
    steps?: Steps;
    minStepDuration?: number;
    scrollIntoView?: boolean;
};

const defaultSteps: Steps = [
    { duration: 1, value: "mounted" },
    { duration: 250, value: "opacity-transition" },
    { duration: 1, value: "finished" },
];

export const AttributeStepper = ({
    attribute = "data-transition-step",
    step: _step = "last",
    steps: _steps = defaultSteps,
    minStepDuration = 25,
    scrollIntoView = false,
    ...rest
}: AttributeStepper) => {
    const wrapperElement = useRef<HTMLDivElement>(null!);

    const animSteps: AnimationStep[] = _steps.map((s) => ({
        label: s.value,
        duration: s.duration,
    }));

    const lastIndex = animSteps.length; // +1 because hook prepends unmounted
    const targetStep = resolveStep(_step, lastIndex);

    const { currentLabel, isAnimating, direction, durationStyles, isMounted } =
        useStepAnimation({
            targetStep,
            steps: animSteps,
            minStepDuration,
            scrollIntoView,
            elementRef: wrapperElement,
        });

    if (!isMounted) return null;

    const transitionValue = isAnimating && `transition ${direction}`;
    const attr = { [attribute]: cx(currentLabel, transitionValue) };

    return (
        <div
            {...rest}
            {...attr}
            style={
                {
                    ...durationStyles,
                    ...rest.style,
                } as CSSProperties
            }
            ref={wrapperElement}
            aria-hidden={isAnimating || undefined}
        />
    );
};

function resolveStep(
    step: AttributeStepper["step"],
    lastIndex: number
): number {
    if (step === "first") return 0;
    if (step === "last") return lastIndex;
    if (step >= lastIndex) return lastIndex;
    if (step <= 0) return 0;
    return step;
}
