import { jest } from "@jest/globals";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Checkbox } from "../components-shared/Checkbox/Checkbox";

test("renders with label text", () => {
    render(<Checkbox>Enable feature</Checkbox>);
    expect(screen.getByText("Enable feature")).toBeInTheDocument();
});

test("renders unchecked by default when no defaultValue", () => {
    render(<Checkbox>Test</Checkbox>);
    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();
});

test("renders checked when defaultValue is true", () => {
    render(<Checkbox defaultValue={true}>Test</Checkbox>);
    const input = screen.getByRole("checkbox");
    expect(input).toBeChecked();
});

test("toggles checked state on click", () => {
    render(<Checkbox>Toggle me</Checkbox>);
    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();
    fireEvent.click(input);
    expect(input).toBeChecked();
    fireEvent.click(input);
    expect(input).not.toBeChecked();
});

test("calls onChange callback", () => {
    const onChange = jest.fn();
    render(<Checkbox onChange={onChange}>Test</Checkbox>);
    const input = screen.getByRole("checkbox");
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
});

test("syncs with defaultValue prop changes", () => {
    const { rerender } = render(<Checkbox defaultValue={false}>Test</Checkbox>);
    const input = screen.getByRole("checkbox");
    expect(input).not.toBeChecked();
    rerender(<Checkbox defaultValue={true}>Test</Checkbox>);
    expect(input).toBeChecked();
});

test("wrapper div has role='none'", () => {
    render(<Checkbox>Test</Checkbox>);
    expect(screen.getByRole("none")).toBeInTheDocument();
});
