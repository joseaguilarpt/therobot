import React from "react";
import { render, screen } from "@testing-library/react";
import GridItem from "./GridItem";

// Mock FadeInComponent to just render children
vi.mock("../FadeIn/FadeIn", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="fadein">{children}</div>,
}));

describe("GridItem", () => {
    it("renders children", () => {
        render(<GridItem>Test Content</GridItem>);
        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("renders FadeInComponent when animation is provided", () => {
        render(
            <GridItem animation="fade-in">
                Animated Content
            </GridItem>
        );
        expect(screen.getByTestId("fadein")).toBeInTheDocument();
        expect(screen.getByText("Animated Content")).toBeInTheDocument();
    });

    it("passes extra props to the div", () => {
        const handleClick = vi.fn();
        render(
            <GridItem data-testid="grid" onClick={handleClick}>
                Clickable
            </GridItem>
        );
        screen.getByTestId("grid").click();
        expect(handleClick).toHaveBeenCalled();
    });
});