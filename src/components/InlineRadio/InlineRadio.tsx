import React, { useState, useEffect, useRef } from "react";
import { getId } from "../utils";
import "./inline-radio.css";

type FieldSetProps = React.HTMLAttributes<HTMLFieldSetElement>;
export type InlineRadio = Omit<FieldSetProps, "onChange"> & {
    options: InlineRadioOption[];
    defaultValue?: InlineRadioOption["value"];
    onChange?: (next?: string, prev?: string) => void;
    legend?: string;
    name?: string;
};

export const InlineRadio = ({
    defaultValue,
    options,
    onChange,
    legend,
    name,
    ...rest
}: InlineRadio) => {
    const [value, setValue] = useState<InlineRadioOption["value"]>(
        defaultValue || getValue(options)
    );

    const id = name || getId();
    const container = useRef<HTMLElement | null>(null);
    const setRef = (node: HTMLFieldSetElement) => (container.current = node);

    const handleChange = (e: React.FormEvent<HTMLFieldSetElement>) => {
        const prev = value;
        const next = (e.target as any).value;
        setValue(next);
        onChange?.(next, prev);
    };

    // calculate checked-indicator (caret) left and right position
    useEffect(() => {
        if (!container.current) return;
        const selector = ":checked + label"; // "div:has(:checked)";
        const checkedEl = container.current.querySelector(
            selector
        ) as HTMLElement;
        const parentWidth = container.current?.offsetWidth;
        const left = checkedEl?.offsetLeft;
        const right = parentWidth - left - checkedEl?.offsetWidth;
        container.current.style.setProperty("--caret-left", `${left}px`);
        container.current.style.setProperty("--caret-right", `${right}px`);
    }, [value]);

    useEffect(() => {
        setValue(defaultValue || getValue(options));
    }, [defaultValue]);

    return (
        <fieldset
            {...rest}
            className="radio inline"
            onChange={handleChange}
            ref={setRef}
        >
            {legend && <legend>{legend}</legend>}
            <div className="options">
                <div className="checked-indicator"></div>
                {options
                    .map((i, idx) => {
                        return {
                            ...i,
                            id: `${id}_id_${idx}`,
                            key: idx,
                            name: id,
                            checked: i.value === value,
                        };
                    })
                    .map(InlineRadioItem)}
            </div>
        </fieldset>
    );
};

type RadioProps = React.HTMLAttributes<HTMLInputElement>;
type InlineRadioOption = RadioProps & {
    text: string;
    value: string;
    checked?: boolean;
    name?: string;
};

const InlineRadioItem = ({
    checked,
    name,
    value,
    text,
    ...rest
}: InlineRadioOption) => {
    const id = rest.id || getId();
    return (
        <div className="option" key={id}>
            <input
                {...rest}
                tabIndex={!checked ? -1 : undefined}
                type="radio"
                readOnly
                id={id}
                value={value}
                checked={checked}
                name={name}
            />
            <label htmlFor={id}>{text}</label>
        </div>
    );
};

const getValue = (opts: InlineRadioOption[]): InlineRadioOption["value"] => {
    const checked = opts.find((i) => i.checked);
    if (checked) return checked.value;
    return opts[0].value;
};
