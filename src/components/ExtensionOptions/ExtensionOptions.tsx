import React from "react";
import { SettingsForm } from "../Settings";
import "./extension-options.css";

type ExtensionOptionsProps = {
    origin?: SettingsForm["origin"];
};

const anchorProps = {
    target: "_blank",
    href: "http://github.com/yakunins",
    mail: "mailto:s@yakunins.com",
};

export const ExtensionOptions = ({ origin }: ExtensionOptionsProps) => {
    return (
        <div className="extension-options">
            <SettingsForm origin={origin} />
            <p className="copy-info">
                2022, 2024 © <a {...anchorProps}>yakunins@github</a>
                <br />
            </p>
        </div>
    );
};
