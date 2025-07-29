import React, { useState, useEffect, useRef, useId, memo } from "react";

import { cx } from "../../utils";
import { RadioButton } from "./RadioButton";
import { useSize } from "../../hooks";
import "./radio.css";

type FieldSetProps = React.HTMLAttributes<HTMLFieldSetElement>;
export type Radio = Omit<FieldSetProps, "onChange"> & {
    options: RadioButton[];
    defaultValue?: RadioButton["value"];
    onChange: (next?: string, prev?: string) => void;
    legend?: React.ReactNode;
    name?: string;
};

export const Radio = memo(
    ({ defaultValue, options, onChange, legend, name, ...rest }: Radio) => {
        const id = name || useId();
        const container = useRef<HTMLDivElement>(null!);
        const { width } = useSize(container);
        const [value, setValue] = useState<RadioButton["value"]>(
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
            const cc = container?.current || null;
            if (!cc) return;
            const input = cc.querySelector(".checked input") as HTMLElement;
            input.focus();
        };

        // calculate checked-indicator (caret) left and right position
        useEffect(() => {
            const cc = container?.current || null;
            if (!cc) return;
            const checked = cc.querySelector(".checked") as HTMLElement;
            const l = checked?.offsetLeft;
            const w = checked?.offsetWidth;
            // const w = checked?.getBoundingClientRect().width // offsetWidth could be not precise enough
            cc.style.setProperty("--checked-left", `${l}px`);
            cc.style.setProperty("--checked-width", `${w}px`);
        }, [value, width]);

        useEffect(() => {
            setValue(defaultValue!);
        }, [defaultValue]);

        return (
            <fieldset
                {...rest}
                className={cx("radio", rest.className)}
                onChange={handleChange}
            >
                <div className="fieldset-style-wrapper">
                    {legend && <legend onClick={focusValue}>{legend}</legend>}
                    <div
                        className={cx("radio-options", getCheckedClassName())}
                        ref={container}
                    >
                        <div className="checked-indicator" />
                        {options
                            .map((i, idx) => {
                                return {
                                    ...i,
                                    id: `id_${id}_${idx}`,
                                    name: id,
                                    checked: i.value === value,
                                };
                            })
                            .map((props, idx) => (
                                <RadioButton {...props} key={idx} />
                            ))}
                    </div>
                </div>
            </fieldset>
        );
    }
);

const getValue = (opts: RadioButton[]): RadioButton["value"] => {
    const checked = opts.find((i) => i.checked);
    if (checked) return checked.value;
    return opts[0].value;
};

const getFieldSetValue = (opts: HTMLCollection): RadioButton["value"] => {
    const opts2 = Array.from(opts) as HTMLInputElement[];
    const checked = opts2.find((i) => i.checked);
    if (checked) return checked.value;
    return opts2[0].value;
};
