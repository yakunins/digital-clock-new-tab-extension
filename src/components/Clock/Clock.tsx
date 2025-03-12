import React, { useCallback, useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Digit, BlinkingDigit, Blinker } from "react-led-digit";
import { SettingsStore as Settings } from "../";
import { getTimeString, getLocale } from "../../utils";
import { Innout } from "../../components-shared";

import "./clock.css";

const blinker = new Blinker(); // singleton

export const Clock = observer(
    ({ ...rest }: React.HTMLAttributes<HTMLTimeElement>) => {
        const [timeString, setTimeString] = useState(
            getTimeString(locale(Settings.clockType))
        );

        const handleBlink = useCallback(() => {
            const time = getTimeString(locale(Settings.clockType));
            setTimeString(time);
        }, []);

        useEffect(() => {
            blinker.period = 2000;
            blinker.subscribe(handleBlink);
            return () => blinker.unsubscribe(handleBlink);
        }, []);

        useEffect(() => {
            handleBlink();
        }, [Settings.clockType]);

        const thickness = (Settings.segmentThickness / 100) * 2.5;
        const length = (Settings.segmentLength / 100) * 12;
        const shape = ["natural", "diamond"].includes(Settings.segmentShape)
            ? "default"
            : (Settings.segmentShape as Digit["shape"]);
        const cornerShift =
            Settings.segmentShape === "natural"
                ? `calc(${thickness}em * .25)`
                : undefined;

        const pillSpacing = `calc(${thickness}em * .35)`;
        const rectSpacing = `calc(${thickness}em * .75)`;
        const spacing =
            Settings.segmentShape === "pill"
                ? pillSpacing
                : Settings.segmentShape === "rect"
                  ? rectSpacing
                  : undefined;

        const segmentStyle = {
            thickness: `max(${thickness}em, 2px)`,
            length: `max(${length}em, ${thickness}em, 4px)`,
            opacityOff: 0.075,
            cornerShift: cornerShift,
            spacing: spacing,
        } as Digit["segmentStyle"];

        const clockStyle = {
            "--thickness": segmentStyle?.thickness,
            "--length": segmentStyle?.length,
        } as React.CSSProperties;

        const ampm = timeString.trim().endsWith("am")
            ? "am"
            : timeString.trim().endsWith("pm")
              ? "pm"
              : null;

        return (
            <time className="clock" {...rest} style={clockStyle}>
                <div className="clock-frame"></div>
                <div className="clock-glow"></div>
                {timeString.split("").map((i, idx) => {
                    if (i == ":" || i === ".")
                        return (
                            <BlinkingDigit
                                key={idx}
                                value={i}
                                shape={shape}
                                segmentStyle={segmentStyle}
                            />
                        );
                    if ("0123456789".includes(i))
                        return (
                            <Digit
                                key={idx}
                                value={i as "0"}
                                shape={shape}
                                segmentStyle={segmentStyle}
                            />
                        );
                    return null;
                })}
                <Innout
                    out={!ampm}
                    stages={ampmAnimationStages}
                    style={{ display: "flex" }}
                >
                    <Digit
                        key="ampm"
                        off={!ampm}
                        value={ampm || "am"}
                        segmentStyle={segmentStyle}
                    />
                </Innout>
            </time>
        );
    }
);

const ampmAnimationStages = [
    {
        duration: 250,
        class_in: "width-in",
        class_out: "width-out",
    },
    {
        duration: 250,
        class_in: "fade-in",
        class_out: "fade-out",
    },
];

function locale(clockFormat: Settings["clockType"]) {
    switch (clockFormat) {
        case "24-hour":
            return "en-GB";
        case "ampm":
            return "en-US";
        default:
            return getLocale();
    }
}
