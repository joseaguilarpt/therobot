import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import ContactWithWhatsapp from "./ContactWhatsapp";


// Mock useTranslation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("ContactWithWhatsapp", () => {
    const phoneNumber = "+1 (234) 567-8900";
    const message = "Test message";

    let openSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    });

    afterEach(() => {
        openSpy.mockRestore();
    });

    it("renders the button with translated text", () => {
        render(<ContactWithWhatsapp phoneNumber={phoneNumber} />);
        expect(screen.getByRole("button")).toHaveTextContent("share.viaWhatsapp");
    });

    it("calls window.open with correct WhatsApp URL when clicked", () => {
        render(<ContactWithWhatsapp phoneNumber={phoneNumber} message={message} />);
        fireEvent.click(screen.getByRole("button"));
        const formattedPhone = "12345678900";
        const encodedMsg = encodeURIComponent(message);
        expect(openSpy).toHaveBeenCalledWith(
            `https://wa.me/${formattedPhone}?text=${encodedMsg}`,
            "_blank"
        );
    });

    it("uses default message if none is provided", () => {
        render(<ContactWithWhatsapp phoneNumber={phoneNumber} />);
        fireEvent.click(screen.getByRole("button"));
        const formattedPhone = "12345678900";
        expect(openSpy).toHaveBeenCalledWith(
            `https://wa.me/${formattedPhone}?text=${encodeURIComponent("Hello!")}`,
            "_blank"
        );
    });

    it("does not disable the button when isDisabled is false", () => {
        render(<ContactWithWhatsapp phoneNumber={phoneNumber} isDisabled={false} />);
        expect(screen.getByRole("button")).not.toBeDisabled();
    });
});