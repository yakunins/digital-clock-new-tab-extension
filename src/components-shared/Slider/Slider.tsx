import React, { ReactNode } from "react";
import {
    Label,
    Slider as AriaSlider,
    SliderProps as AriaSliderProps,
    SliderOutput,
    SliderThumb,
    SliderTrack,
} from "react-aria-components";
import { SliderState } from "@react-stately/slider";

import "./slider.css";

export type Slider = Omit<AriaSliderProps, "onChange"> & {
    label?: string;
    onChange?: (value: number) => void;
    outputFormatter?: (state: SliderState) => ReactNode;
};

export const Slider = ({
    label,
    onChange,
    outputFormatter,
    ...rest
}: Slider) => {
    const handleChange = (value: number | number[]) => {
        if (typeof value === "number" && onChange) {
            onChange(value);
        }
    };

    return (
        <AriaSlider {...rest} onChange={handleChange}>
            {label && <Label>{label}</Label>}
            {outputFormatter ? (
                <SliderOutput>
                    {({ state }) => outputFormatter(state)}
                </SliderOutput>
            ) : (
                <SliderOutput />
            )}
            <SliderTrack>
                <SliderThumb />
            </SliderTrack>
        </AriaSlider>
    );
};

export const SliderControlled = ({ defaultValue, ...rest }: Slider) => {
    let [value, setValue] = React.useState(defaultValue);

    React.useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    return <Slider {...rest} value={value} />;
};
