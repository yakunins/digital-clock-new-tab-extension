import React from "react";
import { clsx } from "clsx";

type IconName = keyof typeof iconNames;
type SpanProps = React.HTMLAttributes<HTMLSpanElement>;
export type Icon = SpanProps & {
    name: IconName;
};

export const Icon = ({ name, ...rest }: Icon) => {
    return (
        <span {...rest} className={clsx("icon", rest.className)}>
            {iconNames[name]}
        </span>
    );
};

const closeIcon1px = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z" />
    </svg>
);

const closeIcon2px = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
    </svg>
);

const menuIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
    </svg>
);

const shapeDiamond = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16">
        <path
            d="M16,3l5,5l-5,5H-3.5V3H16 M16,2H-3.5c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1H16c0.3,0,0.5-0.1,0.7-0.3l5-5
			c0.4-0.4,0.4-1,0-1.4l-5-5C16.5,2.1,16.3,2,16,2L16,2z"
        />
    </svg>
);

const shapeSegment = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16">
        <path
            d="M19,3l2,2l-8,8H-3.5V3H19 M19,2H-3.5c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1H13c0.3,0,0.5-0.1,0.7-0.3l8-8
			c0.4-0.4,0.4-1,0-1.4l-2-2C19.5,2.1,19.3,2,19,2L19,2z"
        />
    </svg>
);

const shapeRectangle = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16">
        <path d="M19,3v10H-3.5V3H19 M19,2H-3.5c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1H19c0.6,0,1-0.4,1-1V3C20,2.4,19.6,2,19,2L19,2z" />
    </svg>
);

const shapePill = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16">
        <path
            d="M15,3c2.8,0,5,2.2,5,5s-2.2,5-5,5H-3.5V3H15 M15,2H-3.5c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1H15c3.3,0,6-2.7,6-6
			S18.3,2,15,2L15,2z"
        />
    </svg>
);

const iconNames = {
    closeIcon1px,
    closeIcon2px,
    menuIcon,
    shapeDiamond,
    shapeSegment,
    shapeRectangle,
    shapePill,
};
