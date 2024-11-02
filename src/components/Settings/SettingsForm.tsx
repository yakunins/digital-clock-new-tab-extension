import React, { ChangeEventHandler } from "react";
import { observer } from "mobx-react";
import { SettingsStore } from "./settings.store";
import { InlineRadio } from "../InlineRadio";
import { SliderControlled, Slider } from "../Slider";

import "./settings-form.css";

export const SettingsForm = observer(() => {
    const handleClockChange: InlineRadio["onChange"] = (next) => {
        SettingsStore.setClockType(next as SettingsStore["clockType"]);
    };
    const handleColorSchemaChange: InlineRadio["onChange"] = (next) => {
        SettingsStore.setColorSchema(next as SettingsStore["colorSchema"]);
    };
    const handleLengthChange: Slider["onChange"] = (next) => {
        SettingsStore.setLength(next as SettingsStore["segmentLength"]);
    };
    const handleThicknessChange: Slider["onChange"] = (next) => {
        SettingsStore.setThickness(next as SettingsStore["segmentThickness"]);
    };
    const handleCssChange = (val?: string) => {
        SettingsStore.setCss(val);
    };
    const handleReset = () => {
        SettingsStore.reset();
    };

    return (
        <div className="settings-form">
            <InlineRadio
                legend="Clock"
                defaultValue={SettingsStore.clockType}
                options={[
                    { value: "24-hour", text: "24-hour" },
                    { value: "ampm", text: "AM-PM" },
                ]}
                onChange={handleClockChange}
            />
            <SliderControlled
                label="Segment Length"
                defaultValue={SettingsStore.segmentLength}
                onChange={handleLengthChange}
                minValue={10}
                maxValue={100}
            />
            <SliderControlled
                label="Segment Thickness"
                defaultValue={SettingsStore.segmentThickness}
                onChange={handleThicknessChange}
                minValue={10}
                maxValue={100}
            />
            <InlineRadio
                legend="Background"
                defaultValue={SettingsStore.colorSchema}
                options={[
                    { value: "natural", text: "Sky" },
                    { value: "random", text: "Random" },
                    {
                        value: JSON.stringify(SettingsStore.colors),
                        text: "Current",
                    },
                ]}
                onChange={handleColorSchemaChange}
            />
            <CssEditor
                onChange={handleCssChange}
                defaultValue={SettingsStore.css}
            />
            <div className="reset-to-defaults">
                <button onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
});

type CssEditorProps = {
    onChange?: (val?: string) => void;
    defaultValue?: string;
};
const CssEditor = ({ onChange, defaultValue }: CssEditorProps) => {
    const [text, setText] = React.useState(defaultValue);

    const onChangeFn = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const next = e?.target?.value;
        setText(next);
        onChange?.(next);
    };

    React.useEffect(() => {
        setText(defaultValue);
    }, [defaultValue]);

    return (
        <div className="custom-style-editor">
            <label htmlFor="textarea">Custom CSS</label>
            <textarea rows={4} onChange={onChangeFn} value={text} />
            <div className="error message">{}</div>
        </div>
    );
};
