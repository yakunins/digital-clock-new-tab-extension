import React, {
    useCallback,
    useState,
    useRef,
    useEffect,
    useMemo,
    CSSProperties,
} from "react";

import { cx } from "../../utils";
import "./innout.css";

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
    scrollIntoView?: boolean; // show entire element on last step of in animation
};

const unmounted = { value: "unmounted" }; // never rendered as
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
    const steps: Steps = useMemo(() => [unmounted, ..._steps], [_steps]);
    const [step, setStep] = useState<number>(stepIndex(steps, _step));
    const tid = useRef<ReturnType<typeof setTimeout>>(-1);
    const wrapperElement = useRef<HTMLDivElement>(null!);

    const dir = useCallback(() => {
        const targetStep = stepIndex(steps, _step);
        if (targetStep > step) return "forward";
        if (targetStep < step) return "backward";
        return null;
    }, [toStr(steps), step]);

    const durationsVariables = _steps.reduce(
        (acc, i) => {
            if (i?.duration) {
                acc[`--duration-${i.value}`] = `${i.duration}ms`;
            }
            return acc;
        },
        {} as Record<string, string>
    );

    const attr = useMemo(() => {
        const inTransition = dir() !== null;
        const transitionValue = inTransition && `transition ${dir}`; // e.g. "transition forward"

        return { [`${attribute}`]: cx(steps[step].value, transitionValue) };
    }, [toStr(steps), step]);

    const handleScrollIntoView = () => {
        if (!scrollIntoView) return;
        if (tid.current < 0) return; // prevents scrollIntoView on first render
        if (dir() === "backward") return;
        if (step === last(steps)) {
            wrapperElement.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    function moveForward() {
        setStep((p) => p + 1);
    }
    function moveBackward() {
        setStep((p) => p - 1);
    }

    function scheduleNext() {
        if (dir() === null) return;
        clearTimeout(tid.current);
        const duration = !steps[step].duration
            ? 0
            : Math.max(steps[step].duration, minStepDuration);

        switch (dir()) {
            case "forward":
                tid.current = setTimeout(moveForward, duration);
                break;
            case "backward":
                tid.current = setTimeout(moveBackward, duration);
                break;
        }
    }

    useEffect(() => {
        scheduleNext();
        return () => clearTimeout(tid.current);
    }, [_step, step, toStr(steps)]);

    useEffect(() => {
        handleScrollIntoView();
    }, [_step, scrollIntoView, step]);

    if (step === 0) return null;

    return (
        <div
            {...rest}
            {...attr}
            style={
                {
                    ...durationsVariables,
                    ...rest.style,
                } as CSSProperties
            }
            ref={wrapperElement}
        />
    );
};

const toStr = (...args: any) => {
    try {
        const res = JSON.stringify(args);
        return res;
    } catch (err) {
        console.warn(err);
    }
};

const last = (arr: any[]): number => arr.length - 1;
const stepIndex = (arr: any[], step: AttributeStepper["step"]): number => {
    if (step === "first") return 0;
    if (step === "last") return last(arr);
    if (step >= last(arr)) return last(arr);
    if (step <= 0) return 0;
    return step;
};
