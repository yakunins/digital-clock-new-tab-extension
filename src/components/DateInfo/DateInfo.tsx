import type { JSX } from "react";
import React, { useCallback, useState, useEffect, memo } from "react";
import { observer } from "mobx-react";
import { Blinker } from "react-led-digit";
import { getDateString, getLocale, popularLocales } from "../../utils";
import { SettingsStore as Settings } from "../";
import { Innout } from "../../components-shared";
import "./date-info.css";
import "./work-sans-100.css";
import "./work-sans-200.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type DateInfo = DivProps & {};

const blinker = new Blinker(); // singleton to update in sync with others

export const DateInfo = observer(({ ...rest }: DateInfo) => {
    const locale = getLocale(); // popularLocales[15]
    const dateLong = () => getDateString(locale, "long", Settings.timeShift);
    const dateShort = () => getDateString(locale, "short", Settings.timeShift);
    const dateStyled = () =>
        Settings.dateStyle === "short" ? dateShort : dateLong;

    const [dateString, setDateString] = useState<string>(dateStyled());

    // const handleBlink = () => setDateString(getDateString());
    const handleBlink = useCallback(() => {
        const date = getDateString(
            locale,
            Settings.dateStyle,
            Settings.timeShift
        );
        setDateString(date);
    }, [Settings.dateStyle]);

    useEffect(() => {
        blinker.subscribe(handleBlink);
        return () => blinker.unsubscribe(handleBlink);
    });
    useEffect(() => {
        handleBlink();
    }, [Settings.dateStyle]);

    return (
        <div
            {...rest}
            className={`date-info locale-${locale} date-style-${Settings.dateStyle}`}
        >
            <Innout
                key="1"
                out={Settings.dateStyle !== "short"}
                stages={dateAnimationStages}
            >
                <FormattedDate dateString={dateShort()} format={"short"} />
            </Innout>
            <Innout
                key="2"
                out={Settings.dateStyle !== "long"}
                stages={dateAnimationStages}
            >
                <FormattedDate dateString={dateLong()} format={"long"} />
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
        <div className={`formatted date-${format}`}>
            <WrapNumbers text={dateString} />
        </div>
    );
});

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
