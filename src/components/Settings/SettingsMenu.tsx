import React, { useState, useEffect, useCallback, useRef } from "react";
import { SettingsForm } from "./SettingsForm";
import { SettingsStore as Settings } from "./settings.store";
import { Innout } from "../Innout";
import "./settings-menu.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

const sessionStorageItem = "digital_clock_newtab__settings_opened";
const initialOpened = sessionStorage.getItem(sessionStorageItem) === "true";

export const SettingsMenu = ({ ...rest }: DivProps) => {
    const settingsRef = useRef<HTMLDivElement>(null);
    const [opened, setOpened] = useState(initialOpened);

    const toggle = () => setOpened(!opened);
    const close = useCallback(() => setOpened(false), []);
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && toggle();
    const handleClickOutside = (e: MouseEvent) => {
        if (!settingsRef.current?.contains(e.target as any)) {
            close();
        }
    };
    const handleActivity = () => {};

    useEffect(() => {
        sessionStorage.setItem(sessionStorageItem, opened.toString());
        document.addEventListener("focus", handleActivity);
        document.addEventListener("keydown", handleEscape);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [opened]);

    return (
        <div {...rest} className="settings-menu" ref={settingsRef}>
            <SetActiveStore origin="tab" />
            <SettingsToggleButton onClick={toggle} opened={opened} />
            <Innout out={!opened}>
                <div className="settings-overlay">
                    <SettingsForm close={close} origin="tab" />
                </div>
            </Innout>
        </div>
    );
};

type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;
type SettingsToggleButton = ButtonProps & {
    onClick: () => void;
    opened: boolean;
};
export const SettingsToggleButton = ({
    onClick,
    opened,
    ...rest
}: SettingsToggleButton) => {
    return (
        <button
            {...rest}
            className="settings-toggle button"
            onClick={onClick}
            aria-label="Settings"
        >
            <span className="hover-layer"></span>
            <Innout out={!opened}>{closeIcon2px}</Innout>
            <Innout out={opened}>{menuIcon}</Innout>
        </button>
    );
};

// taking care of proper value of Settings.isLastActive
const SetActiveStore = ({ origin }: { origin: Settings["origin"] }) => {
    origin && Settings.setOrigin(origin);
    const handleActive = (e?: Event) => {
        const visible = document.visibilityState === "visible";
        if (visible) {
            Settings.setActiveStore(Settings.storeId);
        }
    };

    React.useEffect(() => {
        handleActive();
        document.addEventListener("visibilitychange", handleActive);
        return () => {
            document.removeEventListener("visibilitychange", handleActive);
        };
    }, []);

    return null;
};

const closeIcon1px = (
    <span className="icon">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5f6368"
        >
            <path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z" />
        </svg>
    </span>
);

const closeIcon2px = (
    <span className="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
    </span>
);

const menuIcon = (
    <span className="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
        </svg>
    </span>
);
