import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    CSSProperties,
} from "react";

import { cx } from "../../utils";
import "./innout.css";

type Stage = {
    duration: number;
    class_in: string;
    class_out: string;
};
type Stages = Stage[];

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type Innout = DivProps & {
    out: boolean;
    stages?: Stages;
    minimumDuration?: number;
    scrollIntoView?: boolean; // show full element on last stage of in animation
};

const unmountStages = [
    {
        duration: 0,
        class_in: "out", // unmounted
        class_out: "out", // unmounted
    },
    {
        duration: 10,
        class_in: "in-start", // just mounted
        class_out: "out-end", // to be unmounted
    },
];
const defaultStages = [
    {
        duration: 250,
        class_in: "stage-0-in", // revealing
        class_out: "stage-0-out", // hiding
    },
];
const mountStages = [
    {
        duration: 10,
        class_in: "in-end",
        class_out: "out-start",
    },
    {
        duration: 0,
        class_in: "in", // fully mounted
        class_out: "in", // fully mounted
    },
];

export const Innout = ({
    out,
    stages = defaultStages,
    minimumDuration = 25,
    scrollIntoView = false,
    ...rest
}: Innout) => {
    const allStages = useMemo(
        () => [...unmountStages, ...stages, ...mountStages],
        [stages]
    );
    const lastStage = allStages.length - 1;
    const dir = out ? "out" : "in";
    const [stage, setStage] = useState<number>(out ? 0 : lastStage);
    const prevStage = useRef<number>(out ? 0 : lastStage);
    const tid = useRef<ReturnType<typeof setTimeout>>(-1);
    const innoutWrapperElement = useRef<HTMLDivElement>(null!);

    const durations = stages.reduce(
        (acc, i, idx) => {
            acc[`--stage-${idx}-duration`] = `${i.duration}ms`;
            return acc;
        },
        {} as Record<string, string>
    );

    const styles = {
        ...durations,
        ...rest.style,
    } as CSSProperties;

    const className = useMemo(() => {
        const baseClass = allStages[stage][`class_${dir}`];
        return cx(baseClass, dir);
    }, [allStages, dir, stage]);

    const handleScrollIntoView = () => {
        if (!scrollIntoView) return;
        if (stage === prevStage.current) return; // prevent scrollIntoView on render without staging
        if (stage === lastStage) {
            innoutWrapperElement.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    function nextStage() {
        if (out) {
            if (stage - 1 >= 0) {
                prevStage.current = stage;
                setStage(stage - 1);
            }
        } else {
            if (stage + 1 <= lastStage) {
                prevStage.current = stage;
                setStage(stage + 1);
            }
        }
    }

    function scheduleNextStage() {
        clearTimeout(tid.current);
        const duration =
            allStages[stage].duration === 0
                ? 0
                : allStages[stage].duration > minimumDuration
                  ? allStages[stage].duration
                  : minimumDuration;
        tid.current = setTimeout(() => {
            nextStage();
        }, duration);
    }

    useEffect(() => {
        scheduleNextStage();
        return () => clearTimeout(tid.current);
    }, [out, stage, stages.length]);

    useEffect(() => {
        handleScrollIntoView();
    }, [out, scrollIntoView, stage]);

    if (stage === 0) return null;

    return (
        <div
            {...rest}
            className={cx("innout animation", className)}
            style={styles}
            ref={innoutWrapperElement}
        />
    );
};
