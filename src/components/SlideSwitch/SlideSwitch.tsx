import React, { useState, useEffect, useRef, memo } from "react";
import { clsx } from "clsx";

import { SlideSwitchOption } from "./SlideSwitchOption";
import { getId } from "../utils";
import "./slide-switch.css";

type FieldSetProps = React.HTMLAttributes<HTMLFieldSetElement>;
export type SlideSwitch = Omit<FieldSetProps, "onChange"> & {
    options: SlideSwitchOption[];
    defaultValue?: SlideSwitchOption["value"];
    onChange: (next?: string, prev?: string) => void;
    legend?: string;
    name?: string;
};

export const SlideSwitch = memo(
    ({
        defaultValue,
        options,
        onChange,
        legend,
        name,
        ...rest
    }: SlideSwitch) => {
        const id = useRef(name || getId());
        const parentRef = useRef<HTMLDivElement>(null);
        const [value, setValue] = useState<SlideSwitchOption["value"]>(
            defaultValue || getValue(options)
        );

        function getCheckedClassName() {
            const idx = options
                .map((i) => i.value)
                .findIndex((v) => v === value);
            if (idx === 0) return "checked-first";
            if (idx === options.length - 1) return "checked-last";
        }

        const handleChange = (e: React.FormEvent<HTMLFieldSetElement>) => {
            const prev = value;
            const next = getFieldSetValue(e.currentTarget.elements);
            setValue(next);
            onChange?.(next, prev);
        };

        // calculate checked-indicator (caret) left and right position
        useEffect(() => {
            if (!parentRef.current) return;
            const selector = ":checked + label";
            const checked = parentRef.current.querySelector(
                selector
            ) as HTMLElement;
            const l = checked?.offsetLeft;
            const w = checked?.offsetWidth;
            parentRef.current.style.setProperty("--caret-left", `${l}px`);
            parentRef.current.style.setProperty("--caret-width", `${w}px`);
        }, [value]);

        useEffect(() => {
            setValue(defaultValue!);
        }, [defaultValue]);

        return (
            <fieldset
                {...rest}
                className={clsx("slide-switch", rest.className)}
                onChange={handleChange}
            >
                <div className="fieldset-style-wrapper">
                    {legend && <legend>{legend}</legend>}
                    <div
                        className={clsx("options", getCheckedClassName())}
                        ref={parentRef}
                    >
                        <div className="checked-indicator" />
                        {options
                            .map((i, idx) => {
                                return {
                                    ...i,
                                    id: `id_${id.current}_${idx}`,
                                    name: id.current,
                                    checked: i.value === value,
                                };
                            })
                            .map((props, idx) => (
                                <SlideSwitchOption {...props} key={idx} />
                            ))}
                    </div>
                </div>
            </fieldset>
        );
    }
);

const getValue = (opts: SlideSwitchOption[]): SlideSwitchOption["value"] => {
    const checked = opts.find((i) => i.checked);
    if (checked) return checked.value;
    return opts[0].value;
};
const getFieldSetValue = (opts: HTMLCollection): SlideSwitchOption["value"] => {
    const opts2 = Array.from(opts) as HTMLInputElement[];
    const checked = opts2.find((i) => i.checked);
    if (checked) return checked.value;
    return opts2[0].value;
};
