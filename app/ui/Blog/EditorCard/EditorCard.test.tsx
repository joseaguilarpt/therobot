import React from "react";
import { render, screen } from "@testing-library/react";
import EditorCard from "./EditorCard";
import { vi } from "vitest";

// Mock useTranslation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === "blog.seniorTechnicalEditor") return "Senior Technical Editor";
            if (key === "blog.manuelGomezBio") return "Manuel Gomez is a senior editor with expertise in robotics.";
            return key;
        },
    }),
}));

describe("EditorCard", () => {
    const defaultProps = {
        name: "Manuel Gomez",
        role: "Senior Technical Editor",
        bio: "Manuel Gomez is a senior editor with expertise in robotics.",
        imageUrl: "https://example.com/image.jpg",
    };

    it("renders the editor's image with correct src and alt", () => {
        render(<EditorCard {...defaultProps} />);
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", defaultProps.imageUrl);
        expect(img).toHaveAttribute("alt", defaultProps.name);
    });

    it("renders the editor's name", () => {
        render(<EditorCard {...defaultProps} />);
        expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    });

    it("renders the translated role", () => {
        render(<EditorCard {...defaultProps} />);
        expect(screen.getByText("Senior Technical Editor")).toBeInTheDocument();
    });

    it("renders the translated bio", () => {
        render(<EditorCard {...defaultProps} />);
        expect(screen.getByText("Manuel Gomez is a senior editor with expertise in robotics.")).toBeInTheDocument();
    });

    it("renders the linkedin button", () => {
        render(<EditorCard {...defaultProps} />);
        const button = screen.getByRole("button", { name: /go to linkedin/i });
        expect(button).toBeInTheDocument();
    });
});