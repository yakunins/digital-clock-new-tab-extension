import React, { useCallback } from "react";
import { observer } from "mobx-react";
import { SettingsStore as Settings } from "./settings.store";
import { SlideSwitch } from "../SlideSwitch";
import { SliderControlled, Slider } from "../Slider";
import { Icon } from "../Icon";
import "./settings-form.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
export type SettingsForm = DivProps & {
    close?: () => void;
    origin?: Settings["origin"];
};
export const SettingsForm = observer(
    ({ close, origin, ...rest }: SettingsForm) => {
        origin && Settings.setOrigin(origin);

        const clockChange = useCallback<SlideSwitch["onChange"]>((next) => {
            Settings.setClockType(next as Settings["clockType"]);
        }, []);
        const schemaChange = useCallback<SlideSwitch["onChange"]>((next) => {
            Settings.setColorSchema(next as Settings["colorSchema"]);
        }, []);

        const lengthChange: Slider["onChange"] = (next) => {
            Settings.setLength(next as Settings["segmentLength"]);
        };
        const thicknessChange: Slider["onChange"] = (next) => {
            Settings.setThickness(next as Settings["segmentThickness"]);
        };
        const shapeChange = useCallback<SlideSwitch["onChange"]>((next) => {
            Settings.setShape(next as Settings["segmentShape"]);
        }, []);
        const dateChange = useCallback<SlideSwitch["onChange"]>((next) => {
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
                <SlideSwitch
                    legend="Background"
                    defaultValue={Settings.colorSchema}
                    options={[
                        { value: "sky", children: "Sky" },
                        { value: "random", children: "Random" },
                        { value: "fixed", children: "This" },
                    ]}
                    onChange={schemaChange}
                />
                <SlideSwitch
                    legend="Clock"
                    defaultValue={Settings.clockType}
                    options={[
                        { value: "24-hour", children: "24-hour" },
                        { value: "ampm", children: "AM-PM" },
                    ]}
                    onChange={clockChange}
                />
                <SlideSwitch
                    legend="Date"
                    defaultValue={Settings.dateStyle}
                    options={[
                        { value: "long", children: "Long" },
                        { value: "short", children: "Short" },
                        { value: "none", children: "None" },
                    ]}
                    onChange={dateChange}
                />
                <SliderControlled
                    label="Segment Length"
                    defaultValue={Settings.segmentLength}
                    onChange={lengthChange}
                    minValue={10}
                    maxValue={100}
                />
                <SliderControlled
                    label="Segment Thickness"
                    defaultValue={Settings.segmentThickness}
                    onChange={thicknessChange}
                    minValue={10}
                    maxValue={100}
                />
                <SlideSwitch
                    legend="Segment Shape"
                    defaultValue={Settings.segmentShape}
                    options={[
                        { value: "diamond", children: cornerIcon1 },
                        { value: "natural", children: cornerIcon2 },
                        { value: "rect", children: cornerIcon3 },
                        { value: "pill", children: cornerIcon4 },
                    ]}
                    onChange={shapeChange}
                />
                <Textarea
                    id="custom_css_editor"
                    label="Custom Styles"
                    onChange={cssChange}
                    defaultValue={Settings.css}
                    style={{ resize: "vertical" }}
                />
                <div className="reset-to-defaults _hidden-in-page">
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
    defaultValue?: string;
    label?: string;
    onChange?: React.FormEventHandler<HTMLTextAreaElement>;
};
const Textarea = ({
    defaultValue,
    className,
    label,
    onChange,
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
            <label htmlFor="textarea">{label}</label>
            <textarea
                {...rest}
                rows={4}
                onChange={onChangeFn}
                value={text}
                spellCheck={false}
                lang="css"
            />
            <div className="error message">{}</div>
        </div>
    );
};

const cornerIconStyle = {
    display: "inline-block",
    width: "calc(var(--s-1px) * 24)",
    height: "calc(var(--s-1px) * 16)",
    verticalAlign: "calc(var(--s-1px) * -1)",
    maskImage: "linear-gradient(90deg, transparent 0%, black 100%)",
};
const cornerIcon1 = <Icon name="shapeDiamond" style={cornerIconStyle} />;
const cornerIcon2 = <Icon name="shapeSegment" style={cornerIconStyle} />;
const cornerIcon3 = <Icon name="shapeRectangle" style={cornerIconStyle} />;
const cornerIcon4 = <Icon name="shapePill" style={cornerIconStyle} />;
