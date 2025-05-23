import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TableOfContents from "./TableOfContent";

// Mock dependencies
vi.mock("@remix-run/react", () => ({
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === "blog.table") return "Table of Contents";
            return key;
        },
    }),
}));

const items = [
    { id: "section1", text: "Section 1", level: 1 },
    { id: "section2", text: "Section 2", level: 2 },
    { id: "section3", text: "Section 3", level: 1 },
];

describe("TableOfContents", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the heading with translation", () => {
        render(<TableOfContents items={items} />);
        expect(screen.getByText("Table of Contents")).toBeInTheDocument();
    });

    it("renders all items as links", () => {
        render(<TableOfContents items={items} />);
        items.forEach((item) => {
            const link = screen.getByRole("link", { name: item.text });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", `#${item.id}`);
        });
    });

    it("renders items with correct level classes", () => {
        render(<TableOfContents items={items} />);
        items.forEach((item) => {
            const li = screen.getByText(item.text).closest("li");
            expect(li).toHaveClass(`toc-level-${item.level}`);
        });
    });

    it("enumerates items when enumerate is true", () => {
        render(<TableOfContents items={items} enumerate />);
        items.forEach((item, idx) => {
            expect(screen.getByText(`${idx + 1}) ${item.text}`)).toBeInTheDocument();
        });
    });

    it("does not enumerate items when enumerate is false", () => {
        render(<TableOfContents items={items} />);
        items.forEach((item) => {
            expect(screen.getByText(item.text)).toBeInTheDocument();
        });
        // Should not find text like "1) Section 1"
        expect(screen.queryByText("1) Section 1")).not.toBeInTheDocument();
    });

    it("renders nothing if items is empty", () => {
        render(<TableOfContents items={[]} />);
        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });

    it("renders nothing if items is undefined", () => {
        // @ts-expect-error testing undefined items
        render(<TableOfContents />);
        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });
});