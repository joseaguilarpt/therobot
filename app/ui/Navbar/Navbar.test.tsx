import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import React from "react";

// Mocks
vi.mock("@remix-run/react", () => ({
    useLocation: () => ({
        pathname: "/en/blog",
    }),
}));
vi.mock("~/context/ThemeContext", () => ({
    useTheme: () => ({ theme: "light-mode" }),
}));
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "en" },
    }),
}));

vi.mock("../Icon/Icon", () => ({
    __esModule: true,
    default: (props: any) => <span data-testid="icon">{props.icon}</span>,
}));
vi.mock("../Button/Button", () => ({
    __esModule: true,
    default: (props: any) => (
        <button onClick={props.onClick} aria-label={props["aria-label"] || props.ariaLabel}>
            {props.children}
        </button>
    ),
}));
vi.mock("../Sidebar/Sidebar", () => ({
    __esModule: true,
    default: (props: any) =>
        props.isOpen ? <aside>{props.children}</aside> : null,
}));
vi.mock("../LanguageSelector/LanguageSelector", () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="language-switcher" />,
}));
vi.mock("../ToolSelector/ToolSelector", () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="tool-selector" />,
}));

describe("Navbar", () => {
    beforeEach(() => {
        // Reset scroll position before each test
        window.scrollY = 0;
    });

    it("renders Navbar with custom items", () => {
        const items = [
            { value: "Docs", href: "/en/docs", icon: "book" },
            { value: "About", href: "/en/about", icon: "info" },
        ];
        render(<Navbar items={items} />);
        expect(screen.getByText("Docs")).toBeInTheDocument();
        expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("adds scrolled class when autoScrolled is true", () => {
        render(<Navbar autoScrolled />);
        expect(screen.getByRole("navigation").className).toContain("scrolled");
    });


    it("navigates home when logo button is clicked", () => {
        const originalLocation = window.location;
        // @ts-ignore
        delete window.location;
        window.location = { href: "" };
        render(<Navbar />);
        const homeBtn = screen.getByRole("button", { name: "homePageLink" });
        fireEvent.click(homeBtn);
        expect(window.location.href).toBe("/en");
        window.location = originalLocation;
    });

    it("opens and closes mobile sidebar", () => {
        render(<Navbar />);
        const openBtn = screen.getByRole("button", { name: "openMobileMenu" });
        fireEvent.click(openBtn);
        expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    it("menu items have correct aria-current", () => {
        render(<Navbar />);
        const blogLink = screen.getByRole("menuitem", { name: "Blog" });
        expect(blogLink).toHaveAttribute("aria-current", "page");
    });

    it("renders menu with role menubar and menuitems", () => {
        render(<Navbar />);
        expect(screen.getByRole("menubar")).toBeInTheDocument();
        expect(screen.getAllByRole("menuitem").length).toBeGreaterThan(0);
    });
});