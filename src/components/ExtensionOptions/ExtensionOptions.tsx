import React from "react";
import { SettingsForm } from "../Settings";

type ExtensionOptionsProps = {
    origin?: SettingsForm["origin"];
};

export const ExtensionOptions = ({ origin }: ExtensionOptionsProps) => {
    return <SettingsForm origin={origin} />;
};
