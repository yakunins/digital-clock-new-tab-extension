import { useState, useRef, useEffect } from "react";

export type AnimationStep = {
    label: string;
    duration?: number;
};

export type UseStepAnimationOptions = {
    targetStep: number;
    steps: AnimationStep[];
    minStepDuration?: number;
    scrollIntoView?: boolean;
    elementRef?: React.RefObject<HTMLElement>;
};

export type UseStepAnimationResult = {
    currentStep: number;
    currentLabel: string | null;
    isAnimating: boolean;
    direction: "forward" | "backward" | null;
    durationStyles: Record<string, string>;
    isMounted: boolean;
};

function useStableArray<T>(
    arr: T[],
    isEqual: (a: T, b: T) => boolean
): T[] {
    const ref = useRef(arr);
    if (
        arr.length !== ref.current.length ||
        arr.some((item, i) => !isEqual(item, ref.current[i]))
    ) {
        ref.current = arr;
    }
    return ref.current;
}

const stepsEqual = (a: AnimationStep, b: AnimationStep) =>
    a.label === b.label && a.duration === b.duration;

export function useStepAnimation({
    targetStep,
    steps: userSteps,
    minStepDuration = 25,
    scrollIntoView = false,
    elementRef,
}: UseStepAnimationOptions): UseStepAnimationResult {
    const unmounted: AnimationStep = { label: "unmounted", duration: -1 };
    const steps = [unmounted, ...useStableArray(userSteps, stepsEqual)];

    const [currentStep, setCurrentStep] = useState<number>(targetStep);
    const tid = useRef<ReturnType<typeof setTimeout>>(-1);

    const direction: "forward" | "backward" | null =
        targetStep > currentStep
            ? "forward"
            : targetStep < currentStep
              ? "backward"
              : null;

    const isAnimating = direction !== null;
    const currentLabel = currentStep === 0 ? null : steps[currentStep]?.label ?? null;
    const isMounted = currentStep > 0;
    const lastStep = steps.length - 1;

    const durationStyles = userSteps.reduce(
        (acc, s) => {
            if (s.label && s.duration && s.duration > 0) {
                acc[`--duration-${s.label}`] = `${s.duration}ms`;
            }
            return acc;
        },
        {} as Record<string, string>
    );

    // Step scheduling
    useEffect(() => {
        if (direction === null) return;

        const stepDuration = steps[currentStep]?.duration;
        const delay =
            !stepDuration || stepDuration < 1
                ? 0
                : Math.max(stepDuration, minStepDuration);

        const move = direction === "forward"
            ? () => setCurrentStep((p) => p + 1)
            : () => setCurrentStep((p) => p - 1);

        clearTimeout(tid.current);
        tid.current = setTimeout(move, delay);

        return () => clearTimeout(tid.current);
    }, [targetStep, currentStep, steps]);

    // scrollIntoView
    useEffect(() => {
        if (!scrollIntoView || !elementRef?.current) return;
        if (tid.current < 0) return; // skip first render
        if (direction === "backward") return;
        if (currentStep === lastStep) {
            elementRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollIntoView, currentStep]);

    return {
        currentStep,
        currentLabel,
        isAnimating,
        direction,
        durationStyles,
        isMounted,
    };
}
