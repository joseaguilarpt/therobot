import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MenuDropdown from "./Menu";

const menuItems = [
    { value: "Home", href: "/home", icon: "home" },
    { value: "Profile", href: "/profile" },
];

const renderMenu = (props = {}) =>
    render(
        <MenuDropdown menuItems={menuItems} scrolled={false} {...props} />,
        { wrapper: MemoryRouter }
    );

describe("MenuDropdown", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the menu button", () => {
        renderMenu();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders menu items", () => {
        renderMenu();
        menuItems.forEach(item => {
            expect(screen.getByText(item.value)).toBeInTheDocument();
        });
    });

    it("toggles dropdown open/close on button click", () => {
        renderMenu();
        const button = screen.getByRole("button");
        const list = screen.getByRole("menu");
        expect(list.className).not.toContain("open");
        fireEvent.click(button);
        expect(list.className).toContain("open");
        fireEvent.click(button);
        expect(list.className).not.toContain("open");
    });

    it("closes dropdown when a menu item is clicked", () => {
        renderMenu();
        const button = screen.getByRole("button");
        fireEvent.click(button);
        const list = screen.getByRole("menu");
        expect(list.className).toContain("open");
        fireEvent.click(screen.getByText("Home"));
        expect(list.className).not.toContain("open");
    });

    it("sets aria attributes correctly", () => {
        renderMenu();
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-haspopup", "true");
        expect(button).toHaveAttribute("aria-expanded", "false");
        fireEvent.click(button);
        expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("closes dropdown on Escape key", () => {
        renderMenu();
        const button = screen.getByRole("button");
        fireEvent.click(button);
        fireEvent.keyDown(button, { key: "Escape" });
        const list = screen.getByRole("menu");
        expect(list.className).not.toContain("open");
    });
});