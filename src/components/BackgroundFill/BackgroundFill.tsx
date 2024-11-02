import React, { CSSProperties } from "react";
import { observer } from "mobx-react";
import { SettingsStore } from "../Settings/settings.store";

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
    const strips = SettingsStore.colors;
    const sx = `:root {
        --bg-color-1: ${strips[0]};
        --bg-color-2: ${strips[1]};
        --bg-color-3: ${strips[2]};
        --bg-color-4: ${strips[3]};
    }`;
    return <style>{sx}</style>;
});
