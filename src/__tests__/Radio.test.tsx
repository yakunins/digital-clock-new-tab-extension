import { jest } from "@jest/globals";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock hooks used by Radio (useSize requires ResizeObserver)
jest.unstable_mockModule("../hooks", () => ({
    useSize: () => ({ width: 100, height: 30 }),
}));

const { Radio } = await import("../components-shared/Radio/Radio");

const options = [
    { value: "a", children: "Option A" },
    { value: "b", children: "Option B" },
    { value: "c", children: "Option C" },
];

test("renders all options", () => {
    render(<Radio options={options} onChange={() => {}} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
});

test("shows correct option as checked via defaultValue", () => {
    render(<Radio options={options} defaultValue="b" onChange={() => {}} />);
    const radios = screen.getAllByRole("radio");
    expect(radios[1]).toBeChecked();
});

test("first option is checked when no defaultValue", () => {
    render(<Radio options={options} onChange={() => {}} />);
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeChecked();
});

test("calls onChange with (next, prev) on selection change", () => {
    const onChange = jest.fn();
    render(<Radio options={options} defaultValue="a" onChange={onChange} />);
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[2]);
    expect(onChange).toHaveBeenCalledWith("c", "a");
});

test("syncs with defaultValue prop changes", () => {
    const { rerender } = render(
        <Radio options={options} defaultValue="a" onChange={() => {}} />
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeChecked();
    rerender(
        <Radio options={options} defaultValue="c" onChange={() => {}} />
    );
    expect(radios[2]).toBeChecked();
});

test("checked-indicator has aria-hidden", () => {
    const { container } = render(
        <Radio options={options} onChange={() => {}} />
    );
    const indicator = container.querySelector(".checked-indicator");
    expect(indicator).toHaveAttribute("aria-hidden", "true");
});

test("renders legend when provided", () => {
    render(
        <Radio options={options} onChange={() => {}} legend="Pick one" />
    );
    expect(screen.getByText("Pick one")).toBeInTheDocument();
});
