import React, { useState, useEffect, useCallback, useRef } from "react";
import { SettingsForm } from "./SettingsForm";
import { SettingsStore as Settings } from "./settings.store";
import { Icon, Innout } from "../../components-shared";
import "./settings-dropdown.css";

const sessionStorageItem = "digital_clock_newtab__settings_opened";
const initialOpened = sessionStorage.getItem(sessionStorageItem) === "true";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const SettingsDropdown = ({ ...rest }: DivProps) => {
    const settingsRef = useRef<HTMLDivElement>(null);
    const [opened, setOpened] = useState(initialOpened);

    const toggle = () => setOpened(!opened);
    const close = useCallback(() => setOpened(false), []);
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && toggle();
    const handleClickOutside = (e: MouseEvent) => {
        if (e?.button !== 0) return; // detect left mouse button
        if (!settingsRef.current?.contains(e.target as any)) {
            close();
        }
    };
    const handleFocus = () => {};

    useEffect(() => {
        sessionStorage.setItem(sessionStorageItem, opened.toString());
        document.addEventListener("focus", handleFocus);
        document.addEventListener("keydown", handleEscape);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [opened]);

    return (
        <div {...rest} className="settings-dropdown" ref={settingsRef}>
            <SetActiveStore origin="tab" />
            <SettingsToggleButton onClick={toggle} opened={opened} />
            <Innout out={!opened}>
                <div className="settings-overlay">
                    <div className="scroll-wrapper">
                        <SettingsForm close={close} origin="tab" />
                    </div>
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
            <Innout out={!opened}>
                <Icon name="closeIcon2px" />
            </Innout>
            <Innout out={opened}>
                <Icon name="menuIcon" />
            </Innout>
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
