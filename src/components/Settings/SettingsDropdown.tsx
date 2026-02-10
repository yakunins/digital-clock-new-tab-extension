import React, { useState, useEffect, useCallback, useRef } from "react";
import { SettingsForm } from "./SettingsForm";
import { SettingsStore as Settings } from "../../stores/settings.store";
import { Icon, Innout, Tooltip } from "../../components-shared";
import { useHasScrollbar } from "../../hooks";
import "./settings-dropdown.css";

const sessionStorageItem = "digital_clock_newtab__settings_opened";
const initialOpened = sessionStorage.getItem(sessionStorageItem) === "true";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const SettingsDropdown = ({ ...rest }: DivProps) => {
    const [opened, setOpened] = useState(initialOpened);

    const dropdownElement = useRef<HTMLDivElement>(null!);

    const toggle = () => setOpened((prev) => !prev);
    const close = useCallback(() => setOpened(false), []);
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && toggle();
    const handleClickOutside = (e: MouseEvent) => {
        if (e?.button !== 0) return;
        if (!dropdownElement.current?.contains(e.target as any)) {
            close();
        }
    };
    const handleEffects = () => {
        sessionStorage.setItem(sessionStorageItem, opened.toString());
        if (!dropdownElement.current) return;
        const root = dropdownElement.current.closest("#root");
        if (root instanceof HTMLElement)
            root.dataset.settingsOpened = opened.toString();
    };

    useEffect(handleEffects, [opened]);
    useEffect(() => {
        document.addEventListener("keydown", handleEscape);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div {...rest} className="settings-dropdown" ref={dropdownElement}>
            <SetActiveStore origin="tab" />
            <SettingsToggleButton
                onClick={toggle}
                icon={opened ? "close" : "dots"}
            />
            <Innout out={!opened} className="settings-innout">
                <div className="settings-overlay">
                    <div className="bg-filter"></div>
                    <div className="bg-fill"></div>
                    <ScrollbarWrapper>
                        <SettingsForm close={close} origin="tab" />
                    </ScrollbarWrapper>
                </div>
            </Innout>
        </div>
    );
};

interface ScrollbarWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
const ScrollbarWrapper = ({ children, ...rest }: ScrollbarWrapperProps) => {
    const scrollbarWrapper = useRef<HTMLDivElement>(null!);
    const [hasScrollbar, eventType] = useHasScrollbar(scrollbarWrapper);

    return (
        <div
            className="scrollbar-wrapper"
            ref={scrollbarWrapper}
            data-vertical-scrollbar={hasScrollbar}
            data-vertical-scrollbar-event={eventType}
            {...rest}
        >
            {children}
        </div>
    );
};

type ButtonProps = React.HTMLAttributes<HTMLButtonElement>;
type SettingsToggleButton = ButtonProps & {
    onClick: () => void;
    icon: "close" | "dots";
};
export const SettingsToggleButton = ({
    onClick,
    icon,
    ...rest
}: SettingsToggleButton) => {
    return (
        <Tooltip
            text="Esc"
            direction="left"
            delay={[600, 250]}
            className="settings-toggle"
            useFocus={false}
            useStopMove={true}
            offset="-0.5em"
        >
            <button
                {...rest}
                className="button"
                onClick={onClick}
                aria-label="Settings"
                aria-haspopup="menu"
                aria-expanded={icon === "close"}
            >
                <span className="hover-layer"></span>
                <Innout out={icon === "dots"}>
                    <Icon name="closeIcon2px" />
                </Innout>
                <Innout out={icon === "close"}>
                    <Icon name="menuIcon" />
                </Innout>
            </button>
        </Tooltip>
    );
};

// taking care of proper value of Settings.isLastActive
const SetActiveStore = ({ origin }: { origin: Settings["origin"] }) => {
    React.useEffect(() => {
        if (origin) Settings.setOrigin(origin);
    }, [origin]);

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
