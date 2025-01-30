import React, { useCallback } from "react";
import { observer } from "mobx-react";
import { SettingsStore as Settings } from "./settings.store";
import {
    Collapsible,
    Icon,
    Radio,
    SliderControlled,
    Slider,
    TextEditor,
    Tooltip,
} from "../../components-shared";

import "./settings-form.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
export type SettingsForm = DivProps & {
    close?: () => void;
    origin?: Settings["origin"];
};
export const SettingsForm = observer(
    ({ close, origin, ...rest }: SettingsForm) => {
        origin && Settings.setOrigin(origin);

        const clockChange = useCallback<Radio["onChange"]>((next) => {
            Settings.setClockType(next as Settings["clockType"]);
        }, []);
        const schemaChange = useCallback<Radio["onChange"]>((next) => {
            Settings.setColorSchema(next as Settings["colorSchema"]);
        }, []);

        const lengthChange = useCallback<
            Exclude<Slider["onChange"], undefined>
        >((next: number) => {
            Settings.setLength(next);
        }, []);
        const thicknessChange = useCallback<
            Exclude<Slider["onChange"], undefined>
        >((next: number) => {
            Settings.setThickness(next);
        }, []);

        const shapeChange = useCallback<Radio["onChange"]>((next) => {
            Settings.setShape(next as Settings["segmentShape"]);
        }, []);
        const dateChange = useCallback<Radio["onChange"]>((next) => {
            Settings.setDateStyle(next as Settings["dateStyle"]);
        }, []);

        const cssChange = useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const text = e?.target?.value || "";
                Settings.setCss(text);
            },
            []
        );
        const resetToDefaults = () => {
            Settings.reset();
        };

        return (
            <div className="settings-form" {...rest}>
                <Radio
                    legend={
                        <span style={{ marginRight: ".1em" }}>Background</span>
                    }
                    defaultValue={Settings.colorSchema}
                    options={[
                        { value: "sky", children: "Sky" },
                        { value: "random", children: "Random" },
                        { value: "fixed", children: "This" },
                    ]}
                    onChange={schemaChange}
                />
                <Radio
                    legend="Clock"
                    defaultValue={Settings.clockType}
                    options={[
                        { value: "24-hour", children: "24-hour" },
                        { value: "ampm", children: "AM-PM" },
                    ]}
                    onChange={clockChange}
                />
                <Radio
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
                <Radio
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
                <Collapsible label="Custom Styles" id="custom_styles">
                    <TextEditor
                        id="css_edit"
                        onChange={cssChange}
                        defaultValue={Settings.css}
                        style={{ resize: "vertical" }}
                        rows={5}
                    />
                </Collapsible>
                <div className="reset-to-defaults">
                    <button
                        className="danger button-plus"
                        onClick={resetToDefaults}
                    >
                        Reset to defaults
                    </button>
                </div>
            </div>
        );
    }
);

const helpIconStyle = {
    display: "inline-block",
    width: "calc(var(--s-1px) * 18)",
    height: "calc(var(--s-1px) * 18)",
    marginLeft: "var(--s-1px)",
    marginRight: "var(--s-1px)",
    verticalAlign: "calc(var(--s-1px) * -3)",
    maskImage: "linear-gradient(90deg, transparent 0%, black 100%)",
    opacity: ".65",
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
