import React, { useEffect } from "react";
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
    // Generate random colors once when switching to "random"
    useEffect(() => {
        if (Settings.colorSchema === "random") {
            generateAndSetRandomColors();
        }
    }, [Settings.colorSchema]);

    // Compute display colors
    let colors: string[];
    if (Settings.colorSchema === "sky") {
        colors = saturateFourColors(naturalColors(Settings.skyBackgroundTime), 1.35);
    } else {
        try {
            colors = JSON.parse(Settings.fixedColors);
        } catch {
            colors = ["#ffe8de", "#6e7cca", "#860d0e", "#21022a"];
        }
    }

    // Persist sky colors for cross-tab sync
    useEffect(() => {
        if (Settings.colorSchema === "sky") {
            Settings.setFixedColors(JSON.stringify(colors), true);
        }
    });

    const cssVariables = `:root {
        --theme: ${Settings.colorSchema};
        --bg-color-1: ${colors[0]};
        --bg-color-2: ${colors[1]};
        --bg-color-3: ${colors[2]};
        --bg-color-4: ${colors[3]};
    }`;

    return <style>{cssVariables}</style>;
});

export function generateAndSetRandomColors() {
    const c = randomColors();
    c[0] = lightenColor(c[0], 1);
    c[1] = lightenColor(c[1], 0.8);
    c[2] = mixHexColors(c[2], c[1], 0.2);
    c[2] = lightenColor(c[2], 0.6);
    c[3] = mixHexColors(c[3], c[2], 0.6);
    c[3] = lightenColor(c[3], 0.4);
    Settings.setFixedColors(JSON.stringify(c), false);
}

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
