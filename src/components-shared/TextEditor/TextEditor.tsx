import React, { useId } from "react";
import { clsx } from "clsx";

import "./text-editor.css";

type TextAreaProps = React.HTMLAttributes<HTMLTextAreaElement>;
type TextEditor = TextAreaProps & {
    defaultValue?: string;
    label?: string;
    errorMessage?: string;
    onChange?: React.FormEventHandler<HTMLTextAreaElement>;
    rows?: number;
};

export const TextEditor = ({
    className,
    defaultValue,
    errorMessage,
    label,
    onChange,
    id = useId(),
    ...rest
}: TextEditor) => {
    const [text, setText] = React.useState(defaultValue);

    const onChangeFn = (e?: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e?.target?.value || "";
        setText(text);
        e && onChange?.(e);
    };

    React.useEffect(() => {
        setText(defaultValue);
    }, [defaultValue]);

    return (
        <div
            className={clsx(`text-editor`, className, errorMessage && "error")}
        >
            {label && <label htmlFor={id}>{label}</label>}
            <div className="wrapper focus-within">
                <textarea
                    lang="css"
                    rows={4}
                    spellCheck={false}
                    {...rest}
                    id={id}
                    onChange={onChangeFn}
                    value={text}
                />
            </div>
            {errorMessage && (
                <div className="error message">{errorMessage}</div>
            )}
        </div>
    );
};
