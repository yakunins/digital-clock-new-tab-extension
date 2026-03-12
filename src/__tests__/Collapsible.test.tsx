import { jest } from "@jest/globals";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock Innout to render children directly
jest.unstable_mockModule("../components-shared/Innout", () => ({
    Innout: ({ children, out }: { children: React.ReactNode; out: boolean }) =>
        out ? null : <div>{children}</div>,
}));

// Mock Icon
jest.unstable_mockModule("../components-shared/Icon", () => ({
    Icon: (props: any) => <span data-testid="icon" {...props} />,
}));

const { Collapsible } = await import(
    "../components-shared/Collapsible/Collapsible"
);

test("renders label in summary", () => {
    render(<Collapsible label="Settings">Content</Collapsible>);
    expect(screen.getByText("Settings")).toBeInTheDocument();
});

test("starts collapsed by default", () => {
    render(<Collapsible label="Settings">Content</Collapsible>);
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
});

test("toggles open on summary click", () => {
    render(<Collapsible label="Settings">Content</Collapsible>);
    const summary = screen.getByText("Settings");
    fireEvent.click(summary);
    expect(screen.getByText("Content")).toBeInTheDocument();
});

test("icon has aria-hidden", () => {
    render(<Collapsible label="Settings">Content</Collapsible>);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
});

test("starts expanded when collapsed=false", () => {
    render(
        <Collapsible label="Settings" collapsed={false}>
            Content
        </Collapsible>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
});
