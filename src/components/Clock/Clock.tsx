import React, { useCallback, useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Digit, BlinkingDigit, Blinker } from "react-led-digit";
import { SettingsStore } from "../";
import { getTimeString, getLocale } from "../utils";
import "./clock.css";

const blinker = new Blinker(); // singleton

export const Clock = observer(
    ({ ...rest }: React.HTMLAttributes<HTMLTimeElement>) => {
        const [timeString, setTimeString] = useState(
            getTimeString(locale(SettingsStore.clockType))
        );

        const handleBlink = useCallback(() => {
            const time = getTimeString(locale(SettingsStore.clockType));
            setTimeString(time);
        }, []);

        useEffect(() => {
            blinker.period = 2000;
            blinker.subscribe(handleBlink);
            return () => blinker.unsubscribe(handleBlink);
        }, []);

        useEffect(() => {
            handleBlink();
        }, [SettingsStore.clockType]);

        const thickness = (SettingsStore.segmentThickness / 100) * 1.5;
        const length = (SettingsStore.segmentLength / 100) * 3 + thickness;

        const style = {
            segmentStyle: {
                thickness: `max(${thickness}rem, 2px)`,
                length: `max(${length}rem, 4px)`,
                opacityOff: 0.075,
            } as Digit["segmentStyle"],
        };

        return (
            <time className="clock" {...rest}>
                <div className="clock-frame"></div>
                {timeString.split("").map((i, idx) => {
                    if (i == ":" || i === ".")
                        return <BlinkingDigit key={idx} value={i} {...style} />;
                    if ("0123456789".includes(i))
                        return <Digit key={idx} value={i as "0"} {...style} />;
                    if (i === "a" || i === "p")
                        return (
                            <Digit
                                key={idx}
                                value={(i + "m") as "am"}
                                {...style}
                            />
                        );
                    return null;
                })}
            </time>
        );
    }
);

function locale(clockFormat: SettingsStore["clockType"]) {
    switch (clockFormat) {
        case "24-hour":
            return "en-GB";
        case "ampm":
            return "en-US";
        default:
            return getLocale();
    }
}
