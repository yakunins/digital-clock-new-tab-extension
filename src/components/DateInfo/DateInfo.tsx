import React, { useState, useEffect, memo } from "react";
import { observer } from "mobx-react";
import { Blinker } from "react-led-digit";
import { getLocale, popularLocales } from "../utils";
import { SettingsStore as Settings } from "../";
import { Innout } from "../Innout";
import "./date-info.css";
import "./work-sans-100.css";
import "./work-sans-200.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type DateInfo = DivProps & {};

const blinker = new Blinker(); // singleton

export const DateInfo = observer(({ ...rest }: DateInfo) => {
    const dateStyle = Settings.dateStyle;
    const format = React.useRef(dateStyle === "none" ? "long" : dateStyle);

    const locale = getLocale(); // popularLocales[15]
    const getDateString = (fmt = format.current) =>
        getLocaleString(fmt, new Date(), locale);
    const handleBlink = () => setDateString(getDateString());

    const [dateString, setDateString] = useState<string>(getDateString());

    useEffect(() => {
        blinker.subscribe(handleBlink);
        return () => blinker.unsubscribe(handleBlink);
    });
    useEffect(() => {
        handleBlink();
        if (dateStyle !== "none") format.current = dateStyle;
    }, [dateStyle]);

    return (
        <div {...rest} className={`date-info locale-${locale}`}>
            <Innout
                key="1"
                out={dateStyle !== "short"}
                stages={dateAnimationStages}
            >
                <FormattedDate
                    dateString={getDateString("short")}
                    format={"short"}
                />
            </Innout>
            <Innout
                key="2"
                out={dateStyle !== "long"}
                stages={dateAnimationStages}
            >
                <FormattedDate
                    dateString={getDateString("long")}
                    format={"long"}
                />
            </Innout>
        </div>
    );
});

const dateAnimationStages = [
    {
        duration: 500,
        class_in: "stage-0-in",
        class_out: "stage-0-out",
    },
];

type FormattedDateProps = {
    dateString: string;
    format: "long" | "short";
};
const FormattedDate = memo(({ dateString, format }: FormattedDateProps) => {
    return (
        <div className={`formatted-date date-${format}`}>
            <WrapNumbers text={dateString} />
        </div>
    );
});

export const getLocaleString = (
    format: "long" | "short",
    date = new Date(),
    locale = getLocale() // popularLocales[15]
): string => {
    const localeString = date.toLocaleString(locale, {
        weekday: format,
        day: "numeric",
        month: format,
    });
    return localeString;
};

type WrappedNumsProps = {
    text: string;
    tag?: keyof JSX.IntrinsicElements;
};
const WrapNumbers = ({ text, tag = "em" }: WrappedNumsProps) => {
    const Wrapper = tag;
    const elements = splitNums(text).map((i, idx) =>
        digitsOnly(i) ? (
            <Wrapper key={idx}>{i}</Wrapper>
        ) : (
            <React.Fragment key={idx}>{i}</React.Fragment>
        )
    );
    return <>{elements}</>;
};

const splitNums = (s: string) => s.split(/(\d+)/).filter((i) => i.length > 0);
const digitsOnly = (s: string) => /^\d+$/.test(s);
