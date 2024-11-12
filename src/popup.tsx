import React from "react";
import { createRoot } from "react-dom/client";
import { ExtensionOptions } from "./components";

const root = createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <ExtensionOptions origin="popup" />
    </React.StrictMode>
);
