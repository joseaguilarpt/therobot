import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button, { ButtonProps } from "./Button";

describe("Button", () => {
    it("renders children", () => {
        const { getByText } = render(<Button>Click me</Button>);
        expect(getByText("Click me")).toBeInTheDocument();
    });

    it("applies appareance and size classes", () => {
        const { container } = render(<Button appareance="secondary" size="large">Test</Button>);
        expect(container.firstChild).toHaveClass("button", "button--secondary", "button--large");
    });

    it("renders as <button> by default", () => {
        const { container } = render(<Button>Btn</Button>);
        expect(container.querySelector("button")).toBeInTheDocument();
    });

    it("renders as <a> when href is provided", () => {
        const { container } = render(<Button href="https://test.com">Link</Button>);
        expect(container.querySelector("a")).toBeInTheDocument();
    });

    it("renders as <a> when appareance is 'link'", () => {
        const { container } = render(<Button appareance="link">Link</Button>);
        expect(container.querySelector("a")).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
        const onClick = vi.fn();
        const { getByRole } = render(<Button onClick={onClick}>Click</Button>);
        fireEvent.click(getByRole("button"));
        expect(onClick).toHaveBeenCalled();
    });

    it("does not call onClick when disabled", () => {
        const onClick = vi.fn();
        const { getByRole } = render(<Button isDisabled onClick={onClick}>Disabled</Button>);
        fireEvent.click(getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when loading", () => {
        const onClick = vi.fn();
        const { getByRole } = render(<Button isLoading onClick={onClick}>Loading</Button>);
        fireEvent.click(getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
    });
    
    it("applies aria-label when provided", () => {
        const { getByLabelText } = render(<Button ariaLabel="my-label">Label</Button>);
        expect(getByLabelText("my-label")).toBeInTheDocument();
    });

    it("applies aria-disabled and aria-busy when disabled or loading", () => {
        const { getByRole, rerender } = render(<Button isDisabled>Disabled</Button>);
        expect(getByRole("button")).toHaveAttribute("aria-disabled", "true");
        rerender(<Button isLoading>Loading</Button>);
        expect(getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("applies fit-container class when fitContainer is true", () => {
        const { container } = render(<Button fitContainer>Fit</Button>);
        expect(container.firstChild).toHaveClass("fit-container");
    });

    it("applies rel and target props to <a>", () => {
        const { container } = render(
            <Button href="https://test.com" rel="noopener" target="_blank">Link</Button>
        );
        const anchor = container.querySelector("a");
        expect(anchor).toHaveAttribute("rel", "noopener");
        expect(anchor).toHaveAttribute("target", "_blank");
    });

    it("sets tabIndex -1 when disabled or loading on <a>", () => {
        const { container, rerender } = render(
            <Button href="https://test.com" isDisabled>Link</Button>
        );
        expect(container.querySelector("a")).toHaveAttribute("tabIndex", "-1");
        rerender(<Button href="https://test.com" isLoading>Link</Button>);
        expect(container.querySelector("a")).toHaveAttribute("tabIndex", "-1");
    });

    it("sets tabIndex 0 when enabled on <a>", () => {
        const { container } = render(
            <Button href="https://test.com">Link</Button>
        );
        expect(container.querySelector("a")).toHaveAttribute("tabIndex", "0");
    });
});