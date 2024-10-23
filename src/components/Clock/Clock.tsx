import React, { useCallback, useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Digit, BlinkingDigit, Blinker } from "react-led-digit";
import { SettingsStore } from "../";
import { getTimeString } from "../utils";
import "./clock.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type Clock = DivProps & {
    format?: SettingsStore["ampm"];
};

const blinker = new Blinker(); // singleton

export const Clock = observer(({ ...rest }: Clock) => {
    const [timeString, setTimeString] = useState(
        getTimeString(getLocale(SettingsStore.ampm))
    );

    const handleBlink = useCallback(() => {
        const time = getTimeString(getLocale(SettingsStore.ampm));
        setTimeString(time);
    }, []);

    useEffect(() => {
        blinker.period = 2000;
        blinker.subscribe(handleBlink);
        return () => blinker.unsubscribe(handleBlink);
    }, []);

    useEffect(() => {
        handleBlink();
    }, [SettingsStore.ampm]);

    const sx = {
        segmentStyle: {
            thickness: "0.3em",
            opacityOff: 0.075,
        } as Digit["segmentStyle"],
    };

    return (
        <div className="clock" {...rest}>
            <div className="clock-frame"></div>
            {timeString.split("").map((i, idx) => {
                if (i == ":" || i === ".")
                    return <BlinkingDigit key={idx} value={i} {...sx} />;
                if ("0123456789".includes(i))
                    return <Digit key={idx} value={i as "0"} {...sx} />;
                if (i === "a" || i === "p")
                    return (
                        <Digit key={idx} value={(i + "m") as "am"} {...sx} />
                    );
                return null;
            })}
        </div>
    );
});

function getLocale(ampm: Clock["format"]) {
    if (ampm === "24-hour") return "en-GB";
    if (ampm === "ampm") return "en-US";
    return undefined;
}
