import React, { useState, useEffect, useCallback } from "react";
import { SettingsForm } from "./SettingsForm";
import { Innout } from "../Innout";
import "./settings-menu.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

const sessionStorageItem = "digital_clock_newtab_extension_settings_opened";
const initialOpened = sessionStorage.getItem(sessionStorageItem) === "opened";

export const SettingsMenu = ({ ...rest }: DivProps) => {
    const [opened, setOpened] = useState(initialOpened);
    const toggle = () => {
        setOpened(!opened);
    };
    const close = useCallback(() => setOpened(false), []);

    useEffect(() => {
        sessionStorage.setItem(
            sessionStorageItem,
            opened ? "opened" : "closed"
        );
    }, [opened]);

    return (
        <div className="settings" {...rest}>
            <SettingsButton onClick={toggle} />
            <Innout unmount={!opened}>
                <div {...rest} className="settings-overlay">
                    <div className="left side"></div>
                    <div className="bottom side"></div>
                    <div className="close">
                        <CloseSettingsButton onClick={close} />
                    </div>
                    <SettingsForm />
                </div>
            </Innout>
        </div>
    );
};

type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;
type SettingsButton = ButtonProps & {
    onClick: () => void;
};
export const SettingsButton = ({ onClick, ...rest }: SettingsButton) => {
    return (
        <button
            {...rest}
            className="open-settings button dots icon"
            onClick={onClick}
            aria-label="Settings"
        >
            <span className="hover-layer"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
            </svg>
        </button>
    );
};

type CloseSettingsButton = ButtonProps & {
    onClick: () => void;
};
const CloseSettingsButton = ({ onClick, ...rest }: CloseSettingsButton) => {
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
