import React from "react";
import { observer } from "mobx-react";
import { SettingsStore } from "../Settings";

export const CustomStyle = observer(() => {
    return <style>{SettingsStore.css}</style>;
});
