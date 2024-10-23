import React from "react";
import { createRoot } from "react-dom/client";
import { BackgroundFill, Clock, DateInfo, Settings } from "./components";
import "./newtab.css";

// const initDate = new Date("Wednesday 28 September 2022");

const root = createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <BackgroundFill>
            <Settings />
            <Clock />
            <DateInfo />
        </BackgroundFill>
    </React.StrictMode>
);
