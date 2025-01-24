import React, { useState, useEffect, useRef, memo } from "react";
import { clsx } from "clsx";
import { getId } from "../../utils";

type InputProps = React.HTMLAttributes<HTMLInputElement>;
export type RadioButton = InputProps & {
    children: any;
    value: string;
    checked?: boolean;
    name?: string;
};

export const RadioButton = memo(
    ({ className, checked, name, value, children, ...rest }: RadioButton) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const [focused, setFocused] = useState(false);
        const id = rest.id || getId();

        useEffect(() => {
            focused && inputRef?.current?.focus();
        });

        return (
            <div className={clsx("radio-button", className, { checked })}>
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
