import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    CSSProperties,
} from "react";

import { cx } from "../../utils";
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
    scrollIntoView?: boolean; // show entire element on last step of in animation
};

const unmounted = { duration: -1, name: "unmounted" }; // never rendered
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
    const dir = out ? "out" : "in";
    const steps: Steps = useMemo(
        () => [unmounted, ...classNameSteps],
        [classNameSteps]
    );
    const [step, setStep] = useState<number>(() => (out ? 0 : last(steps)));
    const tid = useRef<ReturnType<typeof setTimeout>>(-1);
    const wrapperElement = useRef<HTMLDivElement>(null!);

    const durations = classNameSteps.reduce(
        (acc, i) => {
            if (i?.name && i?.duration > 0) {
                acc[`--duration-${i.name}`] = `${i.duration}ms`;
            }
            return acc;
        },
        {} as Record<string, string>
    );

    const styles = {
        ...durations,
        ...rest.style,
    } as CSSProperties;

    const stepClassName = useMemo(() => {
        const name = steps[step]?.name;
        const duration = steps[step]?.duration;
        const stepClassName = duration > 0 && name;

        const isAnimating =
            (dir === "in" && step !== last(steps)) ||
            (dir === "out" && step !== 0);
        const animationClassName = isAnimating && `animation ${dir}`; // e.g. "animation in"

        return cx(stepClassName, animationClassName);
    }, [toStr(steps), dir, step]);

    const handleScrollIntoView = () => {
        if (!scrollIntoView) return;
        if (tid.current < 0) return; // prevents scrollIntoView on first render
        if (dir === "out") return;
        if (step === last(steps)) {
            wrapperElement.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    function moveIn() {
        setStep((p) => p + 1);
    }
    function moveOut() {
        setStep((p) => p - 1);
    }

    function scheduleNext() {
        if (dir === "in" && step === last(steps)) return;
        if (dir === "out" && step === 0) return;

        clearTimeout(tid.current);

        const duration =
            steps[step].duration < 1
                ? 0
                : steps[step].duration > minStepDuration
                  ? steps[step].duration
                  : minStepDuration;

        dir === "in"
            ? (tid.current = setTimeout(moveIn, duration))
            : (tid.current = setTimeout(moveOut, duration));
    }

    useEffect(() => {
        scheduleNext();
        return () => clearTimeout(tid.current);
    }, [out, step, toStr(steps)]);

    useEffect(() => {
        handleScrollIntoView();
    }, [out, scrollIntoView, step]);

    if (step === 0) return null;

    return (
        <div
            {...rest}
            className={cx("innout", rest.className, stepClassName)}
            style={styles}
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

const last = (arr: any[]) => arr.length - 1;
