import React from "react";
import { clsx } from "clsx";

import { Icon } from "../Icon";
import { Innout } from "../Innout";
import { useSessionState } from "../../hooks";
import "./collapsible.css";

type DetailsProps = React.HTMLAttributes<HTMLDetailsElement>;
export type Collapsible = DetailsProps & {
    children: React.ReactNode;
    collapsed?: boolean;
    label: React.ReactNode;
    id?: string; // if provided, store state in seesion storage
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
    const [collapsing, setCollapsing] = React.useState(false);

    const handleClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!collapsing && !collapsed) {
            setCollapsing(true);
            setTimeout(() => setCollapsing(false), 250);
        }
        setCollapsed(!collapsed);
    };

    return (
        <details
            {...rest}
            open={!collapsed || collapsing}
            className={clsx(
                "collapsible",
                collapsed && !collapsing ? "collapsed" : "expanded",
                rest.className
            )}
        >
            <summary onClick={handleClick}>
                {icon}
                {label}
            </summary>
            <Innout out={collapsed}>{children}</Innout>
        </details>
    );
};

const icon = <Icon name="chevronDown" />;
