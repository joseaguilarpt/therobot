import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CollapsableList from "./CollapsableList";

const items = [
    { title: "Item 1", content: "Content 1" },
    { title: "Item 2", content: "Content 2" },
    { title: "Item 3", content: "Content 3" },
];

describe("CollapsableList", () => {
    beforeEach(() => {
        // Clear DOM between tests
        document.body.innerHTML = "";
    });

    it("renders all item titles", () => {
        render(<CollapsableList items={items} />);
        items.forEach((item) => {
            expect(screen.getByText(item.title)).toBeInTheDocument();
        });
    });

    it("does not show any content by default", () => {
        render(<CollapsableList items={items} />);
        items.forEach((item) => {
            expect(screen.queryByText(item.content)).not.toBeInTheDocument();
        });
    });

    it("shows content of the initially expanded item", () => {
        render(<CollapsableList items={items} initialExpandedIndex={1} />);
        expect(screen.getByText("Content 2")).toBeInTheDocument();
        expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
    });

    it("expands and collapses items on click", () => {
        render(<CollapsableList items={items} />);
        const headers = screen.getAllByRole("button");

        // Expand first item
        fireEvent.click(headers[0]);
        expect(screen.getByText("Content 1")).toBeInTheDocument();

        // Collapse first item
        fireEvent.click(headers[0]);
        expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });

    it("expands one item at a time", () => {
        render(<CollapsableList items={items} />);
        const headers = screen.getAllByRole("button");

        // Expand first item
        fireEvent.click(headers[0]);
        expect(screen.getByText("Content 1")).toBeInTheDocument();

        // Expand second item
        fireEvent.click(headers[1]);
        expect(screen.getByText("Content 2")).toBeInTheDocument();
        expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });

});