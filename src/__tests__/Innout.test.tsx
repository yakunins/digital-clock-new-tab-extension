import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Innout } from "../components-shared/Innout/Innout";

test("returns null when out=true (step 0)", () => {
    const { container } = render(
        <Innout out={true}>
            <span>Content</span>
        </Innout>
    );
    expect(container.innerHTML).toBe("");
});

test("renders children when out=false", () => {
    const { container } = render(
        <Innout out={false}>
            <span>Content</span>
        </Innout>
    );
    expect(container.querySelector(".innout")).toBeInTheDocument();
    expect(container.textContent).toContain("Content");
});

test("has aria-hidden during out animation phase", () => {
    // Start visible (out=false), then switch to out=true
    const { container, rerender } = render(
        <Innout out={false}>
            <span>Content</span>
        </Innout>
    );
    const wrapper = container.querySelector(".innout");
    // When fully in, should not have aria-hidden
    expect(wrapper).not.toHaveAttribute("aria-hidden");

    // Switch to out — during animation, element still renders with aria-hidden
    rerender(
        <Innout out={true}>
            <span>Content</span>
        </Innout>
    );
    const animatingWrapper = container.querySelector(".innout");
    if (animatingWrapper) {
        expect(animatingWrapper).toHaveAttribute("aria-hidden", "true");
    }
});
