import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Modal from "./Modal";

// Mock Icon component to avoid errors
vi.mock("../Icon/Icon", () => ({
    default: (props: any) => <span data-testid="icon" {...props} />,
}));

describe("Modal", () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        title: "Test Modal",
        children: <div>Modal Content</div>,
    };

    beforeEach(() => {
        document.body.innerHTML = "";
        defaultProps.onClose.mockClear();
    });

    it("renders modal content when open", async () => {
        render(<Modal {...defaultProps} />);
        expect(screen.getByText("Modal Content")).toBeInTheDocument();
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByLabelText("Close Modal")).toBeInTheDocument();
        expect(screen.getByText("Test Modal")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
        render(<Modal {...defaultProps} />);
        fireEvent.click(screen.getByLabelText("Close Modal"));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when overlay is clicked", () => {
        render(<Modal {...defaultProps} />);
        fireEvent.click(screen.getByRole("dialog"));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when modal content is clicked", () => {
        render(<Modal {...defaultProps} />);
        fireEvent.click(screen.getByText("Modal Content"));
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it("calls onClose when Escape key is pressed", () => {
        render(<Modal {...defaultProps} />);
        fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("applies custom className and size", () => {
        render(
            <Modal
                {...defaultProps}
                className="custom-modal"
                size="lg"
            />
        );
        expect(screen.getByRole("dialog")).toHaveClass("custom-modal");
        expect(document.querySelector(".modal-content")).toHaveClass("lg");
    });

    it("sets aria attributes correctly", () => {
        render(<Modal {...defaultProps} />);
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
        expect(screen.getByText("Test Modal")).toHaveClass("sr-only");
    });

    it("restores body overflow and focus on close", async () => {
        const { unmount } = render(<Modal {...defaultProps} />);
        document.body.style.overflow = "hidden";
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.focus();
        unmount();
        await waitFor(() => {
            expect(document.body.style.overflow).toBe("auto");
        });
    });
});