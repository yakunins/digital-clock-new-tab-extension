import React from "react";

import { cx } from "../../utils";
import { Icon } from "../Icon";
import { Innout } from "../Innout";
import { useSessionState } from "../../hooks";
import "./collapsible.css";

type DetailsProps = React.HTMLAttributes<HTMLDetailsElement>;
export type Collapsible = DetailsProps & {
    children: React.ReactNode;
    collapsed?: boolean;
    label: React.ReactNode;
    id?: string; // to store state in session storage, if provided
};

export const Collapsible = ({
    children,
    collapsed: initialCollapsed = true,
    id,
    label,
    ...rest
}: Collapsible) => {
    const sessionStorageId = id ? `collapsible_${id}` : null;

    const [collapsed, setCollapsed] = useSessionState(
        sessionStorageId,
        initialCollapsed
    );
    const [fading, setFading] = React.useState(false);

    const handleClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!fading && !collapsed) {
            setFading(true); // fading out
            setTimeout(() => {
                setFading(false);
            }, 250); // animation duration
        }
        setCollapsed(!collapsed);
    };

    return (
        <details
            {...rest}
            open={!collapsed || fading}
            className={cx(
                "collapsible",
                collapsed && !fading ? "collapsed" : "expanded",
                rest.className
            )}
        >
            <summary onClick={handleClick}>
                {icon}
                {label}
            </summary>
            <Innout scrollIntoView out={collapsed}>
                {children}
            </Innout>
        </details>
    );
};

const icon = <Icon name="chevronDown" />;
