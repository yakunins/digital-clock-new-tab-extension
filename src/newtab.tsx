import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BackgroundFill, Clock, DateInfo, Settings } from "./components";
import "./newtab.css";

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
