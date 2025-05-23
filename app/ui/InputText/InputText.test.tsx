import React, { createRef } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import InputText, { InputTextRef, InputTextProps } from "./InputText";
import { vi } from "vitest";

// Mock i18next translation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (str: string) => str,
    }),
}));

describe("InputText", () => {
    const defaultProps: InputTextProps = {
        label: "Username",
    };

    it("renders label and input", () => {
        render(<InputText {...defaultProps} />);
        expect(screen.getByLabelText("Username")).toBeInTheDocument();
    });

    it("renders placeholder", () => {
        render(<InputText {...defaultProps} placeholder="Enter username" />);
        expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
    });

    it("hides label when isLabelVisible is false", () => {
        render(<InputText {...defaultProps} isLabelVisible={false} />);
        const label = screen.getByText("Username");
        expect(label).toHaveClass("sr-only");
    });

    it("shows required asterisk when isRequired is true", () => {
        render(<InputText {...defaultProps} isRequired />);
        expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders leftIcon if provided", () => {
        render(
            <InputText
                {...defaultProps}
                leftIcon={<span data-testid="icon">icon</span>}
            />
        );
        expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("calls onChange when input changes", () => {
        const onChange = vi.fn();
        render(<InputText {...defaultProps} onChange={onChange} />);
        fireEvent.change(screen.getByLabelText("Username"), {
            target: { value: "abc" },
        });
        expect(onChange).toHaveBeenCalledWith("abc");
    });

    it("calls onFocus and onBlur", () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        render(
            <InputText {...defaultProps} onFocus={onFocus} onBlur={onBlur} />
        );
        const input = screen.getByLabelText("Username");
        fireEvent.focus(input);
        expect(onFocus).toHaveBeenCalled();
        fireEvent.blur(input);
        expect(onBlur).toHaveBeenCalled();
    });

    it("disables input when isDisabled is true", () => {
        render(<InputText {...defaultProps} isDisabled />);
        expect(screen.getByLabelText("Username")).toBeDisabled();
    });

    it("shows error message and error class", () => {
        render(<InputText {...defaultProps} error="Error!" />);
        expect(screen.getByText("Error!")).toBeInTheDocument();
        expect(screen.getByLabelText("Username")).toHaveClass(
            "input-text__input--error"
        );
    });

    it("shows hint text", () => {
        render(<InputText {...defaultProps} hintText="Hint here" />);
        expect(screen.getByText("Hint here")).toBeInTheDocument();
    });

    it("renders clear button and clears input", () => {
        const onChange = vi.fn();
        render(
            <InputText
                {...defaultProps}
                clearButton
                value="abc"
                onChange={onChange}
            />
        );
        const clearBtn = screen.getByRole("button", { name: "clearInput" });
        expect(clearBtn).toBeInTheDocument();
        fireEvent.click(clearBtn);
        expect(onChange).toHaveBeenCalledWith("");
    });

    it("does not render clear button if input is empty", () => {
        render(<InputText {...defaultProps} clearButton value="" />);
        expect(
            screen.queryByRole("button", { name: "clearInput" })
        ).not.toBeInTheDocument();
    });

    it("updates value when prop changes", () => {
        const { rerender } = render(
            <InputText {...defaultProps} value="one" />
        );
        expect(screen.getByLabelText("Username")).toHaveValue("one");
        rerender(<InputText {...defaultProps} value="two" />);
        expect(screen.getByLabelText("Username")).toHaveValue("two");
    });

    it("imperative validate returns false if required and empty", () => {
        const ref = createRef<InputTextRef>();
        render(<InputText {...defaultProps} isRequired ref={ref} value="" />);
        expect(ref.current?.validate()).toBe(false);
    });

    it("imperative validate returns false if validateFormat fails", () => {
        const ref = createRef<InputTextRef>();
        const validateFormat = (v: string) => v === "ok";
        render(
            <InputText
                {...defaultProps}
                ref={ref}
                value="bad"
                validateFormat={validateFormat}
            />
        );
        expect(ref.current?.validate()).toBe(false);
    });

    it("imperative validate returns true if passes all checks", () => {
        const ref = createRef<InputTextRef>();
        const validateFormat = (v: string) => v === "ok";
        render(
            <InputText
                {...defaultProps}
                ref={ref}
                value="ok"
                isRequired
                validateFormat={validateFormat}
            />
        );
        expect(ref.current?.validate()).toBe(true);
    });
    it("imperative getValue returns current value", () => {
        const ref = createRef<InputTextRef>();
        render(<InputText {...defaultProps} ref={ref} value="abc" />);
        expect(ref.current?.getValue()).toBe("abc");
    });
});