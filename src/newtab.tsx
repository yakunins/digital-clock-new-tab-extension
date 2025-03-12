import React from "react";
import { createRoot } from "react-dom/client";
import {
    BackgroundFill,
    Clock,
    DateInfo,
    SettingsDropdown,
    CustomStyle,
} from "./components";
import "./global.css";
import "./mobile.css";

// const initDate = new Date("Wednesday 28 September 2022");

const root = createRoot(document.getElementById("root")!);
const useStrict = true;
const app = (
    <>
        <BackgroundFill />
        <div className="content flex-center-col">
            <Clock />
            <DateInfo />
        </div>
        <SettingsDropdown />
        <CustomStyle />
    </>
);

root.render(useStrict ? <React.StrictMode>{app}</React.StrictMode> : app);
