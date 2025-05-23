import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";

vi.mock("../ContentContainer/ContentContainer", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="content-container">{children}</div>,
}));

describe("Hero", () => {
    it("renders children inside ContentContainer", () => {
        render(<Hero>Test Content</Hero>);
        expect(screen.getByTestId("content-container")).toHaveTextContent("Test Content");
    });

    it("applies the 'hero' and default 'full' size class", () => {
        render(<Hero>Content</Hero>);
        const heroDiv = screen.getByTestId("content-container").parentElement;
        expect(heroDiv).toHaveClass("hero");
        expect(heroDiv).toHaveClass("full");
    });

    it("applies the given background class", () => {
        render(<Hero background="bg-blue">Content</Hero>);
        const heroDiv = screen.getByTestId("content-container").parentElement;
        expect(heroDiv).toHaveClass("bg-blue");
    });

    it("applies the 'half' size class when specified", () => {
        render(<Hero size="half">Content</Hero>);
        const heroDiv = screen.getByTestId("content-container").parentElement;
        expect(heroDiv).toHaveClass("half");
    });

    it("combines all classes correctly", () => {
        render(
            <Hero background="bg-red" size="half">
                Content
            </Hero>
        );
        const heroDiv = screen.getByTestId("content-container").parentElement;
        expect(heroDiv).toHaveClass("hero");
        expect(heroDiv).toHaveClass("bg-red");
        expect(heroDiv).toHaveClass("half");
    });
});