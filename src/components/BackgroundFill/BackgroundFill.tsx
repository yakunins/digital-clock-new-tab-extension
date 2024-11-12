import React from "react";
import { observer } from "mobx-react";
import { SettingsStore as Settings } from "../Settings/settings.store";
import { randomColors } from "./randomColors";
import { naturalColors } from "./naturalColors";
import "./background-fill.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type BackgroundFill = React.PropsWithChildren & DivProps;

export const BackgroundFill = ({ children, ...rest }: BackgroundFill) => {
    return (
        <div className="background-fill" {...rest}>
            <BackgroundFillStyle />
            <div className="strips layer">
                <div className="s1"></div>
                <div className="s2"></div>
                <div className="s3"></div>
                <div className="s4"></div>
            </div>
            <div className="darken layer"></div>
            <div className="blur layer"></div>
            <div className="content layer">{children}</div>
        </div>
    );
};

const BackgroundFillStyle = observer(() => {
    let colors = JSON.parse(Settings.fixedColors);

    switch (Settings.colorSchema) {
        case "sky":
            colors = naturalColors(Settings.backgroundRepaintTimer);
            Settings.setFixedColors(JSON.stringify(colors), true);
            break;
        case "random":
            colors = randomColors();
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
