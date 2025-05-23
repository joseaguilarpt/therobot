import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import Sidebar, { SidebarItem } from "./Sidebar";

// Mock useTranslation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("Sidebar", () => {
    const items: SidebarItem[] = [
        { value: "item1", href: "/item1", icon: "icon1" },
        { value: "item2", href: "/item2", icon: "icon2" },
    ];
    const label = "Sidebar label";
    let onClose: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onClose = vi.fn();
        document.body.innerHTML = "";
    });

    afterEach(() => {
        document.body.style.overflow = "";
    });

    it("renders when open", () => {
        render(<Sidebar isOpen={true} onClose={onClose} label={label} />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByLabelText(label)).toBeInTheDocument();
    });

    it("calls onClose when overlay is clicked", () => {
        render(<Sidebar isOpen={true} onClose={onClose} label={label} />);
        fireEvent.click(screen.getByRole("dialog").previousSibling as HTMLElement);
        expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when close button is clicked", () => {
        render(<Sidebar isOpen={true} onClose={onClose} label={label} />);
        fireEvent.click(screen.getByLabelText("closeSidebar"));
        expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when Escape key is pressed", () => {
        render(<Sidebar isOpen={true} onClose={onClose} label={label} />);
        fireEvent.keyDown(document, { key: "Escape" });
        expect(onClose).toHaveBeenCalled();
    });

    it("applies custom className and id", () => {
        render(
            <Sidebar
                isOpen={true}
                onClose={onClose}
                label={label}
                className="custom-class"
                id="sidebar-id"
            />
        );
        const sidebar = screen.getByRole("dialog");
        expect(sidebar).toHaveClass("custom-class");
        expect(sidebar).toHaveAttribute("id", "sidebar-id");
    });

    it("renders children", () => {
        render(
            <Sidebar isOpen={true} onClose={onClose} label={label}>
                <div data-testid="child">Child</div>
            </Sidebar>
        );
        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("sets body overflow to hidden when open and restores when closed", () => {
        const { rerender } = render(<Sidebar isOpen={true} onClose={onClose} label={label} />);
        expect(document.body.style.overflow).toBe("hidden");
        rerender(<Sidebar isOpen={false} onClose={onClose} label={label} />);
        expect(document.body.style.overflow).toBe("");
    });

    it("traps focus with Tab and Shift+Tab", () => {
        render(
            <Sidebar isOpen={true} onClose={onClose} label={label} items={items} />
        );
        const closeBtn = screen.getByLabelText("closeSidebar");
        const links = screen.getAllByRole("link");
        closeBtn.focus();

        // Shift+Tab on first element moves to last
        fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
        expect(document.activeElement).toBe(links[links.length - 1]);

        // Tab on last element moves to first
        links[links.length - 1].focus();
        fireEvent.keyDown(document, { key: "Tab" });
        expect(document.activeElement).toBe(closeBtn);
    });
});