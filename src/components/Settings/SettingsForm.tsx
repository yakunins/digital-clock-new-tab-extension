import React, { useCallback } from "react";
import { observer } from "mobx-react";
import { SettingsStore as Settings } from "../../stores/settings.store";
import {
    Collapsible,
    Checkbox,
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

        const clockTypeChange = useCallback<Radio["onChange"]>((next) => {
            Settings.setClockType(next as Settings["clockType"]);
        }, []);

        const clockLeadingZeroChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                Settings.setClockLeadingZero(
                    e.target.checked as Settings["clockLeadingZero"]
                );
            },
            []
        );

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

        const faviconChange = useCallback<Radio["onChange"]>((next) => {
            Settings.setFavicon(next as Settings["favicon"]);
        }, []);

        const timeShiftChange = useCallback<
            Exclude<Slider["onChange"], undefined>
        >((minutes: number) => {
            Settings.setTimeShift(minutes);
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
            <div className="settings-form col-gap" {...rest}>
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
                    onChange={clockTypeChange}
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
                <Collapsible label="More Settings" id="additional_settings">
                    <div
                        className="col-gap"
                        style={{ marginTop: "calc(var(--gap-y) / 2)" }}
                    >
                        <Radio
                            className="favicon-radio"
                            legend="Favicon"
                            defaultValue={Settings.favicon}
                            options={[
                                {
                                    value: "browser_default",
                                    children: (
                                        <div>
                                            <Icon
                                                name="earth"
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    opacity: 0.5,
                                                    display: "none",
                                                }}
                                            />
                                            Default
                                        </div>
                                    ),
                                },
                                {
                                    value: "digit",
                                    children: (
                                        <div>
                                            <Icon
                                                name="eight"
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    opacity: 0.5,
                                                    display: "none",
                                                }}
                                            />
                                            Digit
                                        </div>
                                    ),
                                },
                                {
                                    value: "transparent",
                                    children: (
                                        <div>
                                            <Icon
                                                name="square"
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    opacity: 0.1,
                                                    display: "none",
                                                }}
                                            />
                                            None
                                        </div>
                                    ),
                                },
                            ]}
                            onChange={faviconChange}
                        />
                        <SliderControlled
                            label="Time Shift"
                            defaultValue={Settings.timeShift / 15}
                            onChange={(val) => timeShiftChange(val * 15)}
                            minValue={4 * -12}
                            maxValue={4 * 12}
                            outputFormatter={(s) => {
                                const v = s.values[0];
                                if (v === 0) return `0`;
                                const sign = v < 0 ? "-" : "+";
                                const hours = Math.abs(v / 4);
                                const h = ~~hours;
                                const m = (hours % 1) * 60;
                                return `${sign}${h}:${m === 0 ? "00" : m}`;
                            }}
                        />
                        <TextEditor
                            label="Custom Styles"
                            id="css_edit"
                            onChange={cssChange}
                            defaultValue={Settings.css}
                            style={{ resize: "vertical" }}
                            rows={5}
                        />
                        <Checkbox
                            children="Clock Leading Zero"
                            defaultValue={Settings.clockLeadingZero}
                            onChange={clockLeadingZeroChange}
                        />
                    </div>
                </Collapsible>
                <div className="reset-to-defaults">
                    <button
                        disabled={Settings.hasChanges ? false : true}
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
