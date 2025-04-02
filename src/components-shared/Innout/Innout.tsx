import React, { useState, useRef, useEffect, CSSProperties } from "react";

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
    const allStages = [...unmountStages, ...stages, ...mountStages];
    const lastStage = allStages.length - 1;
    const dir = out ? "out" : "in";
    const [stage, setStage] = useState<number>(out ? 0 : lastStage);
    const prevStage = useRef<number>(out ? 0 : lastStage);
    const tid = useRef<ReturnType<typeof setTimeout>>();
    const innoutWrapperElement = useRef<HTMLDivElement>(null);

    const durations = {} as any;
    stages.forEach((i, idx) => {
        durations[`--stage-${idx}-duration`] = i.duration + "ms";
    });
    const styles = {
        ...durations,
        ...rest.style,
    } as CSSProperties;

    const getClassName = React.useCallback(() => {
        const cx = allStages[stage][`class_${dir}`];
        if (out) {
            return addClass(cx, "out");
        } else {
            return addClass(cx, "in");
        }
    }, [out, stage, stages.length]);

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
            className={`innout animation ${getClassName()}`}
            style={styles}
            ref={innoutWrapperElement}
        />
    );
};

const addClass = (cx: string, cls: string) => {
    const parts = cx.split(" ");
    if (parts.includes(cls)) return cx;
    return cls + " " + cx;
};
