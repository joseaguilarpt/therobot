import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

// Mock dependencies
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, opts?: any) => {
            if (typeof opts === "object" && opts.sourceFormat && opts.targetFormat) {
                return `${opts.sourceFormat} to ${opts.targetFormat}`;
            }
            return key;
        },
        i18n: {
            language: "en",
            options: { supportedLngs: ["en", "es"] },
        },
    }),
}));

// Mock constants
vi.mock("~/constants/content", () => ({
    FOOTER: {
        sections: [
            {
                title: "section1",
                links: [
                    { name: "Link1", url: "link1" },
                    { name: "Link2", url: "link2" },
                ],
            },
        ],
    },
}));
vi.mock("~/utils/conversions", () => ({
    POPULAR_CONVERSIONS: [
        { from: "PDF", to: "DOCX", href: "pdf-to-docx" },
        { from: "JPG", to: "PNG", href: "jpg-to-png" },
    ],
}));

describe("Footer", () => {
    const defaultProps = {
        sections: [
            {
                title: "section1",
                links: [
                    { name: "Link1", url: "link1" },
                    { name: "Link2", url: "link2" },
                ],
            },
        ],
        socialNetworks: [],
        address: "123 Main St",
        phone: "555-5555",
        email: "test@example.com",
        copyright: "© 2024",
        backgroundImageUrl: "bg.jpg",
        className: "custom-footer",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders footer with background image and custom class", () => {
        render(<Footer {...defaultProps} />);
        const footer = screen.getByRole("contentinfo");
        expect(footer).toHaveStyle({ backgroundImage: `url(${defaultProps.backgroundImageUrl})` });
        expect(footer.className).toContain("custom-footer");
        expect(footer.className).toContain("footer");
        expect(footer.className).toContain("bg-color-dark");
    });

    it("renders email address", () => {
        render(<Footer {...defaultProps} />);
        expect(screen.getByText("email:")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("renders section titles and links", () => {
        render(<Footer {...defaultProps} />);
        expect(screen.getByText("section1")).toBeInTheDocument();
        expect(screen.getByText("Link1")).toBeInTheDocument();
        expect(screen.getByText("Link2")).toBeInTheDocument();
    });

    it("renders other tools section with conversion links", () => {
        render(<Footer {...defaultProps} />);
        expect(screen.getByText("footer.otherTools.heading")).toBeInTheDocument();
        expect(screen.getByText("PDF to DOCX")).toBeInTheDocument();
        expect(screen.getByText("JPG to PNG")).toBeInTheDocument();
    });

    it("renders copyright", () => {
        render(<Footer {...defaultProps} />);
        expect(screen.getByText("© 2024")).toBeInTheDocument();
    });

    it("localizes link URLs with current locale", () => {
        render(<Footer {...defaultProps} />);
        // The first link in the first section
        const link = screen.getAllByRole("link")[0];
        expect(link).toHaveAttribute("href", "/en/link1");
        // The first conversion link
        const conversionLink = screen.getByText("PDF to DOCX").closest("a");
        expect(conversionLink).toHaveAttribute("href", "/en/pdf-to-docx");
    });
});