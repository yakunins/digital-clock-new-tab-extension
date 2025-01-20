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
        const containter = useRef<HTMLDivElement>(null);
        const [value, setValue] = useState<SlideSwitchOption["value"]>(
            defaultValue || getValue(options)
        );

        function getCheckedClassName() {
            const idx = options
                .map((i) => i.value)
                .findIndex((v) => v === value);
            let suffix = "";
            if (idx === 0) suffix = "checked-first";
            if (idx === options.length - 1) suffix = "checked-last";
            return [`checked-idx-${idx}`, suffix];
        }

        const handleChange = (e: React.FormEvent<HTMLFieldSetElement>) => {
            const prev = value;
            const next = getFieldSetValue(e.currentTarget.elements);
            setValue(next);
            onChange?.(next, prev);
        };

        const focusValue = () => {
            const cc = containter?.current || null;
            if (!cc) return;
            const input = cc.querySelector(".checked input") as HTMLElement;
            input.focus();
        };

        // calculate checked-indicator (caret) left and right position
        useEffect(() => {
            const cc = containter?.current || null;
            if (!cc) return;
            const checked = cc.querySelector(".checked") as HTMLElement;
            const l = checked?.offsetLeft;
            const w = checked?.offsetWidth;
            // const w = checked?.getBoundingClientRect().width // offsetWidth could be not precise enough
            cc.style.setProperty("--checked-left", `${l}px`);
            cc.style.setProperty("--checked-width", `${w}px`);
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
                    {legend && <legend onClick={focusValue}>{legend}</legend>}
                    <div
                        className={clsx("options", getCheckedClassName())}
                        ref={containter}
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
