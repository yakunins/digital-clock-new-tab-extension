// to be used within `options.html` and `popup.html`
import React from "react";
import { SettingsForm } from "../Settings";
import "./extension-options.css";

const author = {
    target: "_blank",
    href: "http://github.com/yakunins",
    children: "yakunins@github",
    mail: "mailto:s@yakunins.com",
};

type ExtensionOptionsProps = {
    origin?: SettingsForm["origin"];
};

export const ExtensionOptions = ({ origin }: ExtensionOptionsProps) => {
    return (
        <div className="extension-options">
            <SettingsForm origin={origin} />
            <p className="copy-info">
                2022, 2024 © <a {...author} />
                <br />
            </p>
        </div>
    );
};
