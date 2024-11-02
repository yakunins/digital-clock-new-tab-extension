import React from "react";
import { SettingsForm } from "../Settings";

export const ExtensionOptions = () => {
    const github = "http://github.com/yakunins";
    const mail = "mailto:s@yakunins.com";
    const styles = `
    .extension-options {margin: 1.35rem 1rem; width: 12rem;}
    .inline.radio {width: 100%;}
    p {margin-top: 1rem;}
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="extension-options">
                <SettingsForm />
                <p>
                    2022, 2024 ©{" "}
                    <a target="_blank" href={github}>
                        Sergey Yakunin
                    </a>
                    <br />
                    Enjoy!
                    <br />
                </p>
            </div>
        </>
    );
};
