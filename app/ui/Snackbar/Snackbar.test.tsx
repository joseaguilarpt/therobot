import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Snackbar from "./Snackbar";
import React from "react";

// Mock useTheme
const hideSnackbar = vi.fn();
const snackbarMock = {
    message: "Test message",
    type: "success" as const,
};
vi.mock("~/context/ThemeContext", () => ({
    useTheme: () => ({
        snackbar: snackbarMock,
        hideSnackbar,
    }),
}));

// Mock useTranslation
const tMock = vi.fn((key: string) => {
    const map: Record<string, string> = {
        "ui.success": "Success",
        "ui.warning": "Warning",
        "ui.info": "Info",
        "ui.error": "Error",
        "closeSnackbar": "Close Snackbar",
    };
    return map[key] || key;
});
vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: tMock }),
}));

// Mock Text component
vi.mock("../Text/Text", () => ({
    default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe("Snackbar", () => {
    beforeEach(() => {
        hideSnackbar.mockClear();
        tMock.mockClear();
        // Reset document.activeElement
        document.body.innerHTML = "";
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.focus();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders the snackbar with correct message and type", () => {
        render(<Snackbar />);
        expect(screen.getByRole("alert")).toHaveClass("snackbar", "snackbar--success");
        expect(screen.getByText("Success:")).toBeInTheDocument();
        expect(screen.getByText("Test message")).toBeInTheDocument();
        expect(screen.getByLabelText("Close Snackbar")).toBeInTheDocument();
    });

    it("calls hideSnackbar and restores focus when close button is clicked", () => {
        const input = document.activeElement as HTMLElement;
        render(<Snackbar />);
        const closeBtn = screen.getByLabelText("Close Snackbar");
        fireEvent.click(closeBtn);
        expect(hideSnackbar).toHaveBeenCalled();
        expect(document.activeElement).toBe(input);
    });

    it("auto-closes after 5 seconds", () => {
        vi.useFakeTimers();
        render(<Snackbar />);
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(hideSnackbar).toHaveBeenCalled();
    });

    it("focuses the snackbar when shown", () => {
        render(<Snackbar />);
        expect(screen.getByRole("alert")).toHaveFocus();
    });

    it("closes on Escape key press", () => {
        render(<Snackbar />);
        fireEvent.keyDown(document, { key: "Escape" });
        expect(hideSnackbar).toHaveBeenCalled();
    });

   
});