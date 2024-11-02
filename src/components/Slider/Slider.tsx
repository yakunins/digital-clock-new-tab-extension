import React from "react";
import {
    Label,
    Slider as AriaSlider,
    SliderProps as AriaSliderProps,
    SliderOutput,
    SliderThumb,
    SliderTrack,
} from "react-aria-components";
import "./slider.css";

export type Slider = AriaSliderProps & {
    label?: string;
};

export const Slider = ({ label, ...rest }: Slider) => {
    return (
        <AriaSlider {...rest}>
            {label && <Label>{label}</Label>}
            <SliderOutput />
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
