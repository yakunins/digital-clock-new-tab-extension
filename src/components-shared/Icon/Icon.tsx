import React from "react";
import { clsx } from "clsx";
import "./icon.css";

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

const chevronDown = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
    </svg>
);

const help = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
    </svg>
);

const earth = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    </svg>
);

const eight = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M10,2.1L8.5,3.6L10,5.1H14l1.5-1.5L14,2.1H10z" />
        <path d="M10,10.5L8.5,12l1.5,1.5H14l1.5-1.5L14,10.5H10z" />
        <path d="M10,18.9l-1.5,1.5l1.5,1.5H14l1.5-1.5L14,18.9H10z" />
        <path d="M17.9,14.3l-1.5-1.5l-1.5,1.5v3.9l1.5,1.5l1.5-1.5V14.3z" />
        <path d="M9.1,14.3l-1.5-1.5l-1.5,1.5v3.9l1.5,1.5l1.5-1.5V14.3z" />
        <path d="M17.9,5.7l-1.5-1.5l-1.5,1.5v3.9l1.5,1.5l1.5-1.5V5.7z" />
        <path d="M9.1,5.7L7.6,4.2L6.1,5.7v3.9l1.5,1.5l1.5-1.5V5.7z" />
    </svg>
);

const square = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" />
    </svg>
);

const iconNames = {
    chevronDown,
    closeIcon1px,
    closeIcon2px,
    earth,
    eight,
    help,
    menuIcon,
    shapeDiamond,
    shapeSegment,
    shapeRectangle,
    shapePill,
    square,
};
