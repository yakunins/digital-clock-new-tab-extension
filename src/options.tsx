import React from "react";
import { createRoot } from "react-dom/client";
import { ExtensionOptions } from "./components";

const root = createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <style>{`div.extension-options {margin-top: 0rem;}`}</style>
        <ExtensionOptions origin="options" />
    </React.StrictMode>
);
