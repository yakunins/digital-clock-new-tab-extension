import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AttributeStepper } from "../components-shared/AttributeStepper/AttributeStepper";

test("returns null at step 0 (first)", () => {
    const { container } = render(
        <AttributeStepper step="first">
            <span>Content</span>
        </AttributeStepper>
    );
    expect(container.innerHTML).toBe("");
});

test("renders with correct data attribute at last step", () => {
    const { container } = render(
        <AttributeStepper step="last">
            <span>Content</span>
        </AttributeStepper>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.getAttribute("data-transition-step")).toContain("finished");
});

test("sets CSS duration variables", () => {
    const steps = [
        { duration: 100, value: "fade" },
        { duration: 200, value: "slide" },
    ];
    const { container } = render(
        <AttributeStepper step="last" steps={steps}>
            <span>Content</span>
        </AttributeStepper>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--duration-fade")).toBe("100ms");
    expect(el.style.getPropertyValue("--duration-slide")).toBe("200ms");
});

test("uses custom attribute name", () => {
    const { container } = render(
        <AttributeStepper step="last" attribute="data-custom">
            <span>Content</span>
        </AttributeStepper>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.hasAttribute("data-custom")).toBe(true);
});
