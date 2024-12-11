import React, { useState, useEffect, useRef, memo } from "react";
import { clsx } from "clsx";
import { getId } from "../utils";
import "./inline-radio.css";

type FieldSetProps = React.HTMLAttributes<HTMLFieldSetElement>;
export type InlineRadio = Omit<FieldSetProps, "onChange"> & {
    options: InlineRadioOption[];
    defaultValue?: InlineRadioOption["value"];
    onChange: (next?: string, prev?: string) => void;
    legend?: string;
    name?: string;
};

export const InlineRadio = memo(
    ({
        defaultValue,
        options,
        onChange,
        legend,
        name,
        ...rest
    }: InlineRadio) => {
        const id = useRef(name || getId());
        const parentRef = useRef<HTMLDivElement>(null);
        const [value, setValue] = useState<InlineRadioOption["value"]>(
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
                className={clsx("inline radio", rest.className)}
                onChange={handleChange}
            >
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
                            <InlineRadioItem {...props} key={idx} />
                        ))}
                </div>
            </fieldset>
        );
    }
);

type RadioProps = React.HTMLAttributes<HTMLInputElement>;
type InlineRadioOption = RadioProps & {
    text: string;
    value: string;
    checked?: boolean;
    name?: string;
};

const InlineRadioItem = memo(
    ({ className, checked, name, value, text, ...rest }: InlineRadioOption) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const [focused, setFocused] = useState(false);
        const id = rest.id || getId();

        useEffect(() => {
            focused && inputRef?.current?.focus();
        });

        return (
            <div className={clsx("option", className, { checked })}>
                <input
                    {...rest}
                    ref={inputRef}
                    tabIndex={!checked ? -1 : undefined}
                    type="radio"
                    readOnly
                    id={id}
                    value={value}
                    checked={checked}
                    name={name}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                <label htmlFor={id}>{text}</label>
            </div>
        );
    }
);

const getValue = (opts: InlineRadioOption[]): InlineRadioOption["value"] => {
    const checked = opts.find((i) => i.checked);
    if (checked) return checked.value;
    return opts[0].value;
};
const getFieldSetValue = (opts: HTMLCollection): InlineRadioOption["value"] => {
    const opts2 = Array.from(opts) as HTMLInputElement[];
    const checked = opts2.find((i) => i.checked);
    if (checked) return checked.value;
    return opts2[0].value;
};
