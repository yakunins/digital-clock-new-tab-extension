import React from "react";
import { MainSettings } from "../Settings/SettingsMenu";

export const ExtensionOptions = () => {
    const github = "http://github.com/yakunins";
    const mail = "mailto:s@yakunins.com";

    return (
        <>
            <style>{`
            .extension-options {margin: 1.35rem 1rem; width: 10rem;}
            .inline.radio {width: 100%;}
            p {margin-top: .5rem;}
            `}</style>
            <div className="extension-options">
                <MainSettings />
                <p>
                    2022, 2024 © Sergey Yakunin
                    <br />
                    Enjoy!
                    <br />
                    <br />
                    <a target="_blank" href={github}>
                        github.com/yakunins
                    </a>
                    <br />
                </p>
            </div>
        </>
    );
};
