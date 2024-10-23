import React from "react";
import { observer } from "mobx-react";
import { SettingsStore } from "./settings.store";
import { InlineRadio } from "../InlineRadio";
import "./settings-menu.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type SettingsMenu = DivProps & {
    close?: () => void;
};

export const SettingsMenu = ({ close, ...rest }: SettingsMenu) => {
    return (
        <div {...rest} className="settings-menu">
            <div className="left side"></div>
            <div className="bottom side"></div>
            {close && (
                <div className="close">
                    <CloseButton onClick={close} />
                </div>
            )}
            <MainSettings />
        </div>
    );
};

export const MainSettings = observer(() => {
    const handleAmpmChange: InlineRadio["onChange"] = (next) => {
        SettingsStore.setAmpm(next as SettingsStore["ampm"]);
    };
    const handleColorSchemaChange: InlineRadio["onChange"] = (next) => {
        SettingsStore.setColorSchema(next as SettingsStore["colorSchema"]);
        console.log(SettingsStore.status);
    };

    return (
        <>
            <InlineRadio
                legend="Time Format"
                defaultValue={SettingsStore.ampm}
                options={[
                    { value: "24-hour", text: "24-Hour" },
                    { value: "ampm", text: "AM-PM" },
                ]}
                onChange={handleAmpmChange}
            />
            <br />
            <br />
            <InlineRadio
                legend="Background Colors"
                defaultValue={SettingsStore.colorSchema}
                options={[
                    { value: "random", text: "Random" },
                    { value: "fixed", text: "Current" },
                ]}
                onChange={handleColorSchemaChange}
            />
            <br />
            <br />
        </>
    );
});

type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;
type CloseButton = ButtonProps & {
    onClick: () => void;
};

const CloseButton = ({ onClick, ...rest }: CloseButton) => {
    const closeIconStroke1px = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5f6368"
        >
            <path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z" />
        </svg>
    );
    const closeIconStroke2px = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
    );
    return (
        <button
            {...rest}
            aria-label="Close"
            className="close button icon"
            onClick={onClick}
        >
            {closeIconStroke1px}
        </button>
    );
};
