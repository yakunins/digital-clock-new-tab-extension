import React, { useState, useCallback, useEffect } from "react";
import { SettingsButton } from "./SettingsButton";
import { SettingsMenu } from "./SettingsMenu";
import { Innout } from "../Innout";
import "./settings.css";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type Settings = DivProps & {};

const sessionStorageItem = "digital_clock_newtab_extension_settings_opened";
const initialOpened = sessionStorage.getItem(sessionStorageItem) === "opened";

export const Settings = ({ ...rest }: Settings) => {
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
                <SettingsMenu close={close} />
            </Innout>
        </div>
    );
};
