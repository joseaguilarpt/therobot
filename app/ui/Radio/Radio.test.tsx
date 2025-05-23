import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Radio from "./Radio";

describe("Radio", () => {
    it("renders with label", () => {
        const { getByText } = render(
            <Radio name="test" label="Option 1" />
        );
        expect(getByText("Option 1")).toBeInTheDocument();
    });

    it("hides label when hideLabel is true", () => {
        const { queryByText } = render(
            <Radio name="test" label="Option 1" hideLabel />
        );
        expect(queryByText("Option 1")).not.toBeInTheDocument();
    });

    it("sets aria-label when provided", () => {
        const { getByLabelText } = render(
            <Radio name="test" ariaLabel="Radio option" />
        );
        expect(getByLabelText("Radio option")).toBeInTheDocument();
    });

    it("is checked by default when defaultChecked is true (uncontrolled)", () => {
        const { getByRole } = render(
            <Radio name="test" defaultChecked label="Option" />
        );
        const input = getByRole("radio");
        expect(input).toBeChecked();
    });

    it("toggles checked state when clicked (uncontrolled)", () => {
        const { getByRole } = render(
            <Radio name="test" label="Option" />
        );
        const input = getByRole("radio");
        expect(input).not.toBeChecked();
        fireEvent.click(input);
        expect(input).toBeChecked();
    });

    it("calls onChange when clicked (controlled)", () => {
        const handleChange = vi.fn();
        const { getByRole } = render(
            <Radio name="test" checked={false} onChange={handleChange} label="Option" />
        );
        const input = getByRole("radio");
        fireEvent.click(input);
        expect(handleChange).toHaveBeenCalled();
    });

    it("reflects checked prop (controlled)", () => {
        const { getByRole, rerender } = render(
            <Radio name="test" checked={false} onChange={() => {}} label="Option" />
        );
        const input = getByRole("radio");
        expect(input).not.toBeChecked();
        rerender(<Radio name="test" checked={true} onChange={() => {}} label="Option" />);
        expect(input).toBeChecked();
    });

    it("passes name prop to input", () => {
        const { getByRole } = render(
            <Radio name="my-radio" label="Option" />
        );
        const input = getByRole("radio");
        expect(input).toHaveAttribute("name", "my-radio");
    });

    it("has the correct class names", () => {
        const { container } = render(
            <Radio name="test" label="Option" />
        );
        expect(container.querySelector("label.radio")).toBeInTheDocument();
        expect(container.querySelector("input.radio__input")).toBeInTheDocument();
        expect(container.querySelector("span.radio__checkmark")).toBeInTheDocument();
        expect(container.querySelector("span.radio__label")).toBeInTheDocument();
    });
});