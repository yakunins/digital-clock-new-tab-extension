import React, { useState, useCallback, useEffect } from "react";
import { Blinker } from "react-led-digit";
import { getDateString } from "../utils";
import "./date-info.css";
import "./work-sans-100.css";
import "./work-sans-200.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type DateInfo = DivProps & {};

const blinker = new Blinker(); // singleton

export const DateInfo = ({ ...rest }: DateInfo) => {
    const [dateString, setDateString] = useState(getDateString());

    const handleBlink = useCallback(() => {
        const date = getDateString();
        setDateString(date);
    }, []);

    useEffect(() => {
        blinker.subscribe(handleBlink);
        return () => blinker.unsubscribe(handleBlink);
    }, []);

    const [weekday, day, month, year] = dateString.split(" ");

    return (
        <div {...rest} className="date-info">
            <div className="weekday">
                <span>{weekday}</span>
            </div>
            <div className="day">
                <span>{day}</span>
            </div>
            <div className="month">
                <span>{month}</span>
            </div>
        </div>
    );
};
