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

const getExtensionVersion = () => {
    let version = undefined;
    try {
        if (chrome?.runtime) {
            return (version = chrome?.runtime?.getManifest().version); // chrome, edge
        }
        if (browser?.runtime) {
            return (version = browser?.runtime?.getManifest().version); // firefox, safari
        }
    } catch (error) {
        console.log(error);
    }
    return version;
};

type ExtensionOptionsProps = {
    origin?: SettingsForm["origin"];
};

export const ExtensionOptions = ({ origin }: ExtensionOptionsProps) => {
    const version = getExtensionVersion();

    return (
        <div className="extension-options">
            <SettingsForm origin={origin} />
            <p className="copy-info">
                {version ? <>v{version} · </> : null}2025 · <a {...author} />
                <br />
            </p>
        </div>
    );
};
