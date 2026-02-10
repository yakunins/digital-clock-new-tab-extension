import React, { useState, useEffect, useRef, useId, memo } from "react";
import { cx } from "../../utils";

type InputProps = React.HTMLAttributes<HTMLInputElement>;
export type RadioButton = InputProps & {
    children?: React.ReactNode;
    value: string;
    checked?: boolean;
    name?: string;
};

export const RadioButton = memo(
    ({ children, checked, className, name, value, ...rest }: RadioButton) => {
        const inputRef = useRef<HTMLInputElement>(null!);
        const [focused, setFocused] = useState(false);
        const generatedId = useId();
        const id = rest.id || generatedId;

        useEffect(() => {
            focused && inputRef?.current?.focus();
        }, [focused]);

        return (
            <div
                className={cx("radio-button", className, checked && "checked")}
            >
                <input
                    {...rest}
                    className="visually-hidden"
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
                <label htmlFor={id}>{children}</label>
            </div>
        );
    }
);
