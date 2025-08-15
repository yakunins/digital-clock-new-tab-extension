import React, { useState, useEffect, useRef, useId, memo } from "react";

import { cx } from "../../utils";
import "./checkbox.css";

export interface Checkbox
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "checked" | "defaultValue" | "onChange"
    > {
    children?: React.ReactNode;
    defaultValue?: boolean;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = memo(
    ({ children, defaultValue, name, onChange, ...rest }: Checkbox) => {
        const [isChecked, setChecked] = useState(defaultValue);
        const [isFocused, setFocused] = useState(false);

        const inputRef = useRef<HTMLInputElement>(null!);
        const id = rest.id || useId();

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setChecked(e.target.checked);
            onChange?.(e);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" || e.key === "Space") {
                inputRef?.current?.click();
            }
        };

        useEffect(() => {
            isFocused && inputRef?.current?.focus();
        }, [isFocused]);

        useEffect(() => {
            setChecked(defaultValue);
        }, [defaultValue]);

        return (
            <div
                className={cx(
                    "checkbox",
                    { checked: isChecked },
                    { focused: isFocused },
                    rest.className
                )}
            >
                <input
                    {...rest}
                    className="visually-hidden"
                    ref={inputRef}
                    type="checkbox"
                    id={id}
                    checked={isChecked}
                    name={name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                <label htmlFor={id}>
                    <div className="box"></div>
                    <div className="label">{children}</div>
                </label>
            </div>
        );
    }
);
