import { jest } from "@jest/globals";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock hooks used by Tooltip
jest.unstable_mockModule("../hooks", () => ({
    useSize: () => ({ width: 100, height: 30 }),
    usePosition: () => ({ top: 50, left: 50 }),
    useFocusWithin: () => false,
    useOpacityTracker: () => 1,
    useHasFocusable: () => false,
}));

// Mock Innout to render children directly
jest.unstable_mockModule("../components-shared/Innout", () => ({
    Innout: ({ children, out }: { children: React.ReactNode; out: boolean }) =>
        out ? null : <div>{children}</div>,
}));

const { Tooltip } = await import(
    "../components-shared/Tooltip/Tooltip"
);

test("renders anchor children", () => {
    render(
        <Tooltip text="Help text">
            <button>Hover me</button>
        </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
});

test("anchor has aria-describedby attribute", () => {
    render(
        <Tooltip text="Help text">
            <button>Anchor</button>
        </Tooltip>
    );
    const anchor = screen.getByText("Anchor").closest(".tooltip-anchor");
    expect(anchor).toHaveAttribute("aria-describedby");
});

test("aria-describedby value is a non-empty string", () => {
    render(
        <Tooltip text="Help text">
            <button>Anchor</button>
        </Tooltip>
    );
    const anchor = screen.getByText("Anchor").closest(".tooltip-anchor");
    const describedBy = anchor?.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(typeof describedBy).toBe("string");
});
