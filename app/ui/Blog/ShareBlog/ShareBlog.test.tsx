import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import ShareSocial from "./ShareBlog";

// Mock dependencies
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("ShareSocial", () => {
    const defaultProps = {
        url: "https://example.com",
        title: "Test Title",
        description: "Test Description",
    };

    let windowOpenSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    });

    afterEach(() => {
        windowOpenSpy.mockRestore();
    });

    it("renders all share buttons", () => {
        render(<ShareSocial {...defaultProps} />);
        expect(screen.getByRole("button", { name: "blog.shareFacebook" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "blog.shareInTwitter" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "blog.shareInLinkedin" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "blog.shareInWhatsapp" })).toBeInTheDocument();
    });

    it("opens Facebook share URL on Facebook button click", () => {
        render(<ShareSocial {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: "blog.shareFacebook" }));
        expect(windowOpenSpy).toHaveBeenCalledWith(
            "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fexample.com",
            "_blank"
        );
    });

    it("opens Twitter share URL on Twitter button click", () => {
        render(<ShareSocial {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: "blog.shareInTwitter" }));
        expect(windowOpenSpy).toHaveBeenCalledWith(
            "https://twitter.com/intent/tweet?url=https%3A%2F%2Fexample.com&text=Test%20Title",
            "_blank"
        );
    });

    it("opens LinkedIn share URL on LinkedIn button click", () => {
        render(<ShareSocial {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: "blog.shareInLinkedin" }));
        expect(windowOpenSpy).toHaveBeenCalledWith(
            "https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fexample.com&title=Test%20Title&summary=Test%20Description",
            "_blank"
        );
    });

    it("opens WhatsApp share URL on WhatsApp button click", () => {
        render(<ShareSocial {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: "blog.shareInWhatsapp" }));
        expect(windowOpenSpy).toHaveBeenCalledWith(
            "https://wa.me/?text=Test%20Title https%3A%2F%2Fexample.com",
            "_blank"
        );
    });
});