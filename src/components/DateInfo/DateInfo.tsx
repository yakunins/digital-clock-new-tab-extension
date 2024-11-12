import React, { useState, useCallback, useEffect, memo } from "react";
import { observer } from "mobx-react";
import { Blinker } from "react-led-digit";
import { getLocale, popularLocales } from "../utils";
import { SettingsStore as Settings } from "../";
import "./date-info.css";
import "./work-sans-100.css";
import "./work-sans-200.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type DateInfo = DivProps & {};

const blinker = new Blinker(); // singleton

export const DateInfo = observer(({ ...rest }: DateInfo) => {
    const dateStyle = Settings.dateStyle;
    const locale = getLocale(); // popularLocales[15]
    const getDateString = () => getLocaleString(dateStyle, new Date(), locale);
    const handleBlink = () => setDateString(getDateString());

    const [dateString, setDateString] = useState<string>(getDateString());

    useEffect(() => {
        blinker.subscribe(handleBlink);
        return () => blinker.unsubscribe(handleBlink);
    });
    useEffect(() => handleBlink(), [dateStyle]);

    if (dateStyle === "none") return null;
    return (
        <div {...rest} className={`date-info locale-${getLocale()}`}>
            <FormattedDate dateString={dateString} dateStyle={dateStyle} />
        </div>
    );
});

type DateStyle = Settings["dateStyle"];
type FormattedDateProps = {
    dateString: string;
    dateStyle: DateStyle;
};
const FormattedDate = memo(({ dateString, dateStyle }: FormattedDateProps) => {
    return (
        <div className={`date-${dateStyle}`}>
            <WrapNumbers text={dateString} />
        </div>
    );
});

export const getLocaleString = (
    format: DateStyle,
    date = new Date(),
    locale = getLocale() // popularLocales[15]
): string => {
    if (format === "none") return "";
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
