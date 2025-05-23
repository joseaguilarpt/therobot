import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Editor from "./Editor";
import React from 'react';

// Mock useTranslation from react-i18next
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === "blog.by") return "By";
            if (key === "blog.minsRead") return "mins read";
            return key;
        },
    }),
}));

describe("Editor", () => {
    const data = {
        editor: "John Doe",
        date: "2024-06-01",
        readTime: "5",
    };

    beforeEach(() => {
        render(<Editor data={data} />);
    });

    it("renders the editor label", () => {
        expect(screen.getByText("By")).toBeInTheDocument();
    });

    it("renders the editor name", () => {
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

    it("renders the date", () => {
        expect(screen.getByText("2024-06-01")).toBeInTheDocument();
    });

    it("renders the read time with label", () => {
        expect(screen.getByText("5 mins read")).toBeInTheDocument();
    });

    it("renders all separators", () => {
        const dashes = screen.getAllByText("-");
        expect(dashes.length).toBe(2);
    });

    it("renders all Text components with correct props", () => {
        // This checks that all expected text nodes are present
        expect(screen.getByText("By")).toBeInTheDocument();
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
        expect(screen.getByText("2024-06-01")).toBeInTheDocument();
        expect(screen.getByText("5 mins read")).toBeInTheDocument();
    });
});