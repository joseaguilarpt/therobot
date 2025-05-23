import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Breadcrumb from "./Breadcrumbs";

// Mock the Link component from @remix-run/react
vi.mock("@remix-run/react", () => ({
    Link: ({ to, children, className }: any) => (
        <a href={to} className={className}>
            {children}
        </a>
    ),
}));

describe("Breadcrumb", () => {
    it("renders a single breadcrumb without link", () => {
        render(<Breadcrumb paths={[{ label: "Home" }]} />);
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
        expect(screen.queryByText("/")).not.toBeInTheDocument();
    });

    it("renders multiple breadcrumbs with links and separators", () => {
        render(
            <Breadcrumb
                paths={[
                    { label: "Home", href: "/" },
                    { label: "Library", href: "/library" },
                    { label: "Data" },
                ]}
            />
        );
        // Links
        expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
        expect(screen.getByRole("link", { name: "Library" })).toHaveAttribute("href", "/library");
        // Last item is not a link
        expect(screen.getByText("Data")).toBeInTheDocument();
        expect(screen.getAllByText("/")).toHaveLength(2);
    });

    it("renders icons when provided", () => {
        render(
            <Breadcrumb
                paths={[
                    { label: "Home", href: "/", icon: "home" },
                    { label: "Library", href: "/library", icon: "book" },
                    { label: "Data" },
                ]}
            />
        );
        expect(screen.getByText("home")).toBeInTheDocument();
        expect(screen.getByText("book")).toBeInTheDocument();
    });

    it("renders correct number of separators", () => {
        render(
            <Breadcrumb
                paths={[
                    { label: "A", href: "/a" },
                    { label: "B", href: "/b" },
                    { label: "C", href: "/c" },
                    { label: "D" },
                ]}
            />
        );
        // Should be one less than number of paths
        expect(screen.getAllByText("/")).toHaveLength(3);
    });

    it("sets aria-label on nav", () => {
        render(<Breadcrumb paths={[{ label: "Home" }]} />);
        expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
    });
});