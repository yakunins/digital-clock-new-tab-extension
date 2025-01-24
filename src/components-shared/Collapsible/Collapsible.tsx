import React from "react";
import { clsx } from "clsx";

import { Icon } from "../Icon";
import { Innout } from "../Innout";
import "./collapsible.css";

type DetailsProps = React.HTMLAttributes<HTMLDetailsElement>;
export type Collapsible = DetailsProps & {
    children: React.ReactNode;
    collapsed?: boolean;
    label: React.ReactNode;
};

export const Collapsible = ({
    children,
    collapsed: initialCollapsed = true,
    label,
    ...rest
}: Collapsible) => {
    const [collapsed, setCollapsed] = React.useState(initialCollapsed === true);
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
