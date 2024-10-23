import React, { useEffect, CSSProperties } from "react";
import { observer } from "mobx-react";
import { SettingsStore } from "../Settings/settings.store";
import { randomHexColors } from "./random-color";
import "./background-fill.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type BackgroundFill = React.PropsWithChildren & DivProps;

const sessionStorageItem = "digital_clock_newtab_extension_current_colors";

export const BackgroundFill = observer(
    ({ children, ...rest }: BackgroundFill) => {
        const colors =
            SettingsStore.colorSchema === "random"
                ? randomHexColors()
                : JSON.parse(SettingsStore.fixedColors);

        const sx = {
            "--bg-color-1": colors[0],
            "--bg-color-2": colors[1],
            "--bg-color-3": colors[2],
            "--bg-color-4": colors[3],
            ...rest.style,
        } as CSSProperties;

        useEffect(() => {
            sessionStorage.setItem(sessionStorageItem, JSON.stringify(colors));
        }, [colors]);

        return (
            <div className="background-fill" {...rest} style={sx}>
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
    }
);
