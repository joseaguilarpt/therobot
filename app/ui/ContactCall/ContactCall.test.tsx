import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactWithCall from "./ContactCall";

// Mock Button component
vi.mock("~/ui/Button/Button", () => ({
    default: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}));

// Mock useTranslation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("ContactWithCall", () => {
    const phoneNumber = "123456789";

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("renders the button with translated text", () => {
        render(<ContactWithCall phoneNumber={phoneNumber} />);
        expect(screen.getByRole("button", { name: "contactCall.call" })).toBeInTheDocument();
    });

    it("calls window.open with tel: url when button is clicked", () => {
        const openSpy = vi.spyOn(window, "open").mockImplementation(() => null as any);
        render(<ContactWithCall phoneNumber={phoneNumber} />);
        const button = screen.getByRole("button", { name: "contactCall.call" });
        fireEvent.click(button);
        expect(openSpy).toHaveBeenCalledWith(`tel:${phoneNumber}`, "_self");
    });
});