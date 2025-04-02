import React from "react";
import { observer } from "mobx-react";
import { SettingsStore as Settings } from "../../stores/settings.store";
import { randomColors } from "./randomColors";
import { naturalColors } from "./naturalColors";
import { lightenColor, saturateFourColors, mixHexColors } from "./colorUtils";

import "./background-fill.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type BackgroundFill = React.PropsWithChildren & DivProps;

export const BackgroundFill = ({ children, ...rest }: BackgroundFill) => {
    return (
        <div className="background-fill" {...rest}>
            <BackgroundFillStyle />
            <div className="gradient layer">
                <Strips />
            </div>
            <div className="blur layer">
                <Strips />
            </div>
            <div className="effects layer"></div>
            <div className="noise layer"></div>
            <div className="solid-color layer"></div>
            <div className="content layer">{children}</div>
        </div>
    );
};

const BackgroundFillStyle = observer(() => {
    let colors = JSON.parse(Settings.fixedColors);

    switch (Settings.colorSchema) {
        case "sky":
            colors = naturalColors(Settings.skyBackgroundTime);
            colors = saturateFourColors(colors, 1.35);
            Settings.setFixedColors(JSON.stringify(colors), true);
            break;
        case "random":
            colors = randomColors();
            colors[0] = lightenColor(colors[0], 1);
            colors[1] = lightenColor(colors[1], 0.8);
            colors[2] = mixHexColors(colors[2], colors[1], 0.2);
            colors[2] = lightenColor(colors[2], 0.6);
            colors[3] = mixHexColors(colors[3], colors[2], 0.6);
            colors[3] = lightenColor(colors[3], 0.4);
            Settings.setFixedColors(JSON.stringify(colors), true);
            break;
    }

    const cssVariables = `:root {
        --theme: ${Settings.colorSchema};
        --bg-color-1: ${colors[0]};
        --bg-color-2: ${colors[1]};
        --bg-color-3: ${colors[2]};
        --bg-color-4: ${colors[3]};
    }`;

    return <style>{cssVariables}</style>;
});

const Strips = () => (
    <>
        <div className="strip-1">
            <div className="mask" />
        </div>
        <div className="strip-2">
            <div className="mask" />
        </div>
        <div className="strip-3">
            <div className="mask" />
        </div>
    </>
);
