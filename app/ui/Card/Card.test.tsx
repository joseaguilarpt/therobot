import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./Card";

// Mock dependencies
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: "en",
            options: { supportedLngs: ["en", "es"] },
        },
    }),
}));

describe("Card", () => {
    const baseProps = {
        id: 1,
        title: "Test Title",
        content: "Test content",
    };

    it("renders with title and content", () => {
        render(<Card {...baseProps} />);
        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test content")).toBeInTheDocument();
    });


    it("renders with conversion", () => {
        render(
            <Card
                {...baseProps}
                conversion={{ from: "USD", to: "EUR" }}
                icon={undefined}
            />
        );
        expect(screen.getByText("USD")).toBeInTheDocument();
        expect(screen.getByText("EUR")).toBeInTheDocument();
    });

    it("renders with image", () => {
        render(<Card {...baseProps} imageUrl="http://image.com/img.png" />);
        const imageDiv = screen.getByRole("img");
        expect(imageDiv).toHaveStyle(
            "background-image: url(http://image.com/img.png)"
        );
        expect(imageDiv).toHaveAttribute("aria-label", "cardImage");
    });

    it("applies underline class to content", () => {
        render(<Card {...baseProps} underline />);
        expect(screen.getByText("Test content").parentElement).toHaveClass("u-pt2");
    });

    it("renders children", () => {
        render(
            <Card {...baseProps}>
                <div data-testid="child">Child</div>
            </Card>
        );
        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("applies custom className", () => {
        render(<Card {...baseProps} className="custom-class" />);
        expect(screen.getByRole("region")).toHaveClass("custom-class");
    });

    it("applies shadow and unstyled classes", () => {
        render(<Card {...baseProps} shadow unstyled />);
        const region = screen.getByRole("region");
        expect(region).toHaveClass("__shadow");
        expect(region).toHaveClass("__unstyled");
    });

    it("uses aria-labelledby and id correctly", () => {
        render(<Card {...baseProps} />);
        const region = screen.getByRole("region");
        expect(region).toHaveAttribute("aria-labelledby", "card-1 card-1-title");
        expect(region).toHaveAttribute("id", "card-1");
        expect(screen.getByText("Test Title")).toHaveAttribute("id", "card-1-title");
    });

    it("renders goNow button if url is provided", () => {
        render(<Card {...baseProps} url="/foo/bar" />);
        expect(screen.getByText("goNow")).toBeInTheDocument();
    });

});