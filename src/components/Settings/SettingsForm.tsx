import React, { useCallback } from "react";
import { observer } from "mobx-react";
import { SettingsStore as Settings } from "./settings.store";
import { InlineRadio } from "../InlineRadio";
import { SliderControlled, Slider } from "../Slider";
import "./settings-form.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
export type SettingsForm = DivProps & {
    close?: () => void;
    origin?: Settings["origin"];
};
export const SettingsForm = observer(
    ({ close, origin, ...rest }: SettingsForm) => {
        origin && Settings.setOrigin(origin);

        const clockChange = useCallback<InlineRadio["onChange"]>((next) => {
            Settings.setClockType(next as Settings["clockType"]);
        }, []);
        const schemaChange = useCallback<InlineRadio["onChange"]>((next) => {
            Settings.setColorSchema(next as Settings["colorSchema"]);
        }, []);

        const lengthChange: Slider["onChange"] = (next) => {
            Settings.setLength(next as Settings["segmentLength"]);
        };
        const thicknessChange: Slider["onChange"] = (next) => {
            Settings.setThickness(next as Settings["segmentThickness"]);
        };
        const shapeChange = useCallback<InlineRadio["onChange"]>((next) => {
            Settings.setShape(next as Settings["segmentShape"]);
        }, []);
        const dateChange = useCallback<InlineRadio["onChange"]>((next) => {
            Settings.setDateStyle(next as Settings["dateStyle"]);
        }, []);

        const cssChange = useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const text = e?.target?.value || "";
                Settings.setCss(text);
            },
            []
        );
        const openPopup = () => {
            chrome.runtime.sendMessage("open_extension_popup");
            close?.();
        };
        const resetToDefaults = () => {
            Settings.reset();
        };

        return (
            <div className="settings-form" {...rest}>
                <InlineRadio
                    className="test"
                    legend="Background"
                    defaultValue={Settings.colorSchema}
                    options={[
                        { value: "sky", text: "Sky" },
                        { value: "random", text: "Random" },
                        { value: "fixed", text: "This" },
                    ]}
                    onChange={schemaChange}
                />
                <InlineRadio
                    legend="Clock"
                    defaultValue={Settings.clockType}
                    options={[
                        { value: "24-hour", text: "24-hour" },
                        { value: "ampm", text: "AM-PM" },
                    ]}
                    onChange={clockChange}
                    style={{ marginBottom: ".35rem" }}
                />
                <SliderControlled
                    label="Segment Length"
                    defaultValue={Settings.segmentLength}
                    onChange={lengthChange}
                    minValue={10}
                    maxValue={100}
                />
                <SliderControlled
                    label="Thickness"
                    defaultValue={Settings.segmentThickness}
                    onChange={thicknessChange}
                    minValue={10}
                    maxValue={100}
                />
                <InlineRadio
                    legend="Shape"
                    defaultValue={Settings.segmentShape}
                    options={[
                        { value: "diamond", text: "1" },
                        { value: "natural", text: "2" },
                        { value: "rect", text: "3" },
                        { value: "pill", text: "4" },
                    ]}
                    onChange={shapeChange}
                />
                <InlineRadio
                    className="hidden-in-page"
                    legend="Date"
                    defaultValue={Settings.dateStyle}
                    options={[
                        { value: "long", text: "Long" },
                        { value: "short", text: "Short" },
                        { value: "none", text: "None" },
                    ]}
                    onChange={dateChange}
                />
                <div className="all-settings hidden-in-popup">
                    <button onClick={openPopup}>More Settings</button>
                </div>
                <CssEditor
                    className="hidden-in-page"
                    onChange={cssChange}
                    defaultValue={Settings.css}
                />
                <div className="reset-to-defaults hidden-in-page">
                    <button className="danger" onClick={resetToDefaults}>
                        Reset to defaults
                    </button>
                </div>
            </div>
        );
    }
);

type TextareaProps = React.HTMLAttributes<HTMLTextAreaElement>;
type CssEditorProps = TextareaProps & {
    onChange?: React.FormEventHandler<HTMLTextAreaElement>;
    defaultValue?: string;
};
const CssEditor = ({
    onChange,
    defaultValue,
    className,
    ...rest
}: CssEditorProps) => {
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
        <div className={`custom-style-editor ${className}`}>
            <label htmlFor="textarea">Custom CSS</label>
            <textarea rows={4} {...rest} onChange={onChangeFn} value={text} />
            <div className="error message">{}</div>
        </div>
    );
};
