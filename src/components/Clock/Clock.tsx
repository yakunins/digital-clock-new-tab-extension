import React, { useCallback, useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Digit, BlinkingDigit, Blinker } from "react-led-digit";
import { SettingsStore as Settings } from "../";
import { getTimeString, getLocale } from "../utils";
import { Innout } from "../Innout";
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
        const length = (Settings.segmentLength / 100) * 8 + thickness;

        const style = {
            segmentStyle: {
                thickness: `max(${thickness}rem, 2px)`,
                length: `max(${length}rem, 4px)`,
                opacityOff: 0.075,
            } as Digit["segmentStyle"],
        };
        const clockStyle = {
            "--thickness": style.segmentStyle?.thickness,
            "--length": style.segmentStyle?.length,
        } as React.CSSProperties;

        const ampm = timeString.trim().endsWith("am")
            ? "am"
            : timeString.trim().endsWith("pm")
              ? "pm"
              : null;
        return (
            <time className="clock" {...rest} style={clockStyle}>
                <div className="clock-frame"></div>
                <div className="clock-shine"></div>
                {timeString.split("").map((i, idx) => {
                    if (i == ":" || i === ".")
                        return <BlinkingDigit key={idx} value={i} {...style} />;
                    if ("0123456789".includes(i))
                        return <Digit key={idx} value={i as "0"} {...style} />;
                    return null;
                })}
                <Innout
                    out={!ampm}
                    style={{ display: "flex" }}
                    stages={ampmAnimationStages}
                >
                    <Digit
                        key="ampm"
                        off={!ampm}
                        value={ampm || "am"}
                        {...style}
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
