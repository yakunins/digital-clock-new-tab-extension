// to be used within `options.html` and `popup.html`
import React from "react";
import { SettingsForm } from "../Settings";
import "./extension-options.css";

const author = {
    target: "_blank",
    href: "https://github.com/yakunins/digital-clock-new-tab-extension",
    children: "yakunins@github",
    mail: "mailto:s@yakunins.com",
};

declare const browser: typeof chrome;
let version = "unknown";
try {
    if (chrome?.runtime) {
        version = chrome?.runtime?.getManifest().version;
    }
    if (browser?.runtime) {
        version = browser?.runtime?.getManifest().version;
    }
} catch (error) {
    console.log(error);
}

type ExtensionOptionsProps = {
    origin?: SettingsForm["origin"];
};

export const ExtensionOptions = ({ origin }: ExtensionOptionsProps) => {
    return (
        <div className="extension-options">
            <SettingsForm origin={origin} />
            <p className="copy-info">
                v{version} · 2025 · <a {...author} />
                <br />
            </p>
        </div>
    );
};
