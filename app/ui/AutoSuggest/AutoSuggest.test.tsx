import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AutoSuggest, { AutoSuggestProps } from "./AutoSuggest";

// Mock dependencies
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const options = [
    { id: "1", label: "Option 1", details: "Details 1" },
    { id: "2", label: "Option 2" },
    { id: "3", label: "Option 3", details: "Details 3" },
];

const baseProps: AutoSuggestProps = {
    options,
    label: "Test Label",
    id: "test-autosuggest",
    className: "",
};

describe("AutoSuggest", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders label and placeholder", () => {
        render(<AutoSuggest {...baseProps} placeholder="Select an option" />);
        expect(screen.getByText("Test Label")).toBeInTheDocument();
        expect(screen.getByRole("button")).toHaveTextContent("Select an option");
    });

    it("does not render label if isLabelVisible is false", () => {
        render(
            <AutoSuggest {...baseProps} isLabelVisible={false} placeholder="X" />
        );
        expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
    });

    it("opens and closes the dropdown on button click", () => {
        render(<AutoSuggest {...baseProps} placeholder="X" />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(screen.getByRole("listbox")).toBeInTheDocument();
        fireEvent.click(button);
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("calls onChange when an option is selected by click", () => {
        const onChange = vi.fn();
        render(
            <AutoSuggest {...baseProps} onChange={onChange} placeholder="X" />
        );
        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getAllByRole("option")[1]);
        expect(onChange).toHaveBeenCalledWith(options[1]);
    });

    it("shows loading or noOptions message", () => {
        const { rerender } = render(
            <AutoSuggest {...baseProps} options={[]} isLoading placeholder="X" />
        );
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("loading")).toBeInTheDocument();

        rerender(<AutoSuggest {...baseProps} options={[]} isLoading={false} />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("disables the button if isDisabled is true", () => {
        render(
            <AutoSuggest {...baseProps} isDisabled placeholder="X" />
        );
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("renders selected value", () => {
        render(
            <AutoSuggest
                {...baseProps}
                value={options[2]}
                placeholder="X"
            />
        );
        expect(screen.getByRole("button")).toHaveTextContent("Option 3");
    });

    it("closes dropdown on Escape key", () => {
        render(<AutoSuggest {...baseProps} placeholder="X" />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(screen.getByRole("listbox")).toBeInTheDocument();
        fireEvent.keyDown(button, { key: "Escape" });
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("closes dropdown on outside click", () => {
        render(
            <div>
                <AutoSuggest {...baseProps} placeholder="X" />
                <button data-testid="outside">Outside</button>
            </div>
        );
        fireEvent.click(screen.getByTestId("left-icon"));
        expect(screen.getByRole("listbox")).toBeInTheDocument();
        fireEvent.mouseDown(screen.getByTestId("outside"));
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
});