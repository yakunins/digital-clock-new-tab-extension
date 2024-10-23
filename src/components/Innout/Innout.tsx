import React, { useState, useRef, useEffect, CSSProperties } from "react";
import "./in-n-out.css";

type Stage = {
    duration: number;
    inClassName: string;
    outClassName: string;
};
type Stages = Stage[];

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type Innout = DivProps & {
    unmount: boolean;
    stages?: Stages;
    minimumDuration?: number;
};

const defaultStages = [
    {
        duration: 250,
        inClassName: "fade-0-in", // mounting
        outClassName: "fade-0-out", // unmounting
    },
];

export const Innout = ({
    unmount = false,
    stages = defaultStages,
    minimumDuration = 20,
    ...rest
}: Innout) => {
    const [stage, setStage] = useState<number>(unmount ? -2 : stages.length);
    const t = useRef<ReturnType<typeof setTimeout>>();

    const durationsObj = {} as any;
    stages.forEach((i, idx) => {
        durationsObj[`--stage-${idx}-duration`] = i.duration + "ms";
    });
    const styles = {
        ...durationsObj,
        ...rest.style,
    } as CSSProperties;

    function getClassName() {
        const dir = unmount ? "out" : "in";
        if (stage < stages.length && stage > -1) {
            return stages[stage][`${dir}ClassName`];
        } else {
            if (stage === -1 || stage === -2) {
                return "out";
            }
            return "in";
        }
    }

    function nextStage() {
        const dir = unmount ? "out" : "in";
        if (dir === "in") {
            const next = stage + 1;
            if (next <= stages.length) setStage(next);
        }
        if (dir === "out") {
            const next = stage - 1;
            if (next >= -2) setStage(next);
        }
    }
    function scheduleNextStage() {
        clearTimeout(t.current);
        const duration =
            stage > -1 && stage < stages.length
                ? stages[stage].duration
                : stage === -2
                ? 0
                : minimumDuration;
        t.current = setTimeout(() => {
            nextStage();
        }, duration);
    }

    useEffect(() => {
        scheduleNextStage();
        return () => clearTimeout(t.current);
    }, [unmount, stage, stages.length]);

    if (stage === -2) return null;
    return (
        <div
            {...rest}
            style={styles}
            className={`in-n-out animation ${getClassName()}`}
        />
    );
};
