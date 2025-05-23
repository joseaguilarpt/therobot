import React from "react";
import { render } from "@testing-library/react";
import Text from "./Text";

describe("Text component", () => {
    it("renders children correctly", () => {
        const { getByText } = render(<Text>Test content</Text>);
        expect(getByText("Test content")).toBeInTheDocument();
    });

    it("applies default props and classes", () => {
        const { container } = render(<Text>Default</Text>);
        const p = container.querySelector("p");
        expect(p).toHaveClass("text");
        expect(p).toHaveClass("text--medium");
        expect(p).toHaveClass("text--primary");
        expect(p).toHaveClass("text--normal");
        expect(p).toHaveClass("text--left");
        expect(p).not.toHaveClass("text--italic");
        expect(p).not.toHaveClass("text--underline");
    });

    it("applies custom className", () => {
        const { container } = render(<Text className="custom-class">Custom</Text>);
        expect(container.querySelector("p")).toHaveClass("custom-class");
    });

    it("applies id and role props", () => {
        const { container } = render(<Text id="my-id" role="note">Props</Text>);
        const p = container.querySelector("p");
        expect(p).toHaveAttribute("id", "my-id");
        expect(p).toHaveAttribute("role", "note");
    });

    it("applies size, color, textWeight, align, transform, fontStyle, and textDecoration classes", () => {
        const { container } = render(
            <Text
                size="large"
                color="secondary"
                textWeight="bold"
                align="center"
                transform="uppercase"
                fontStyle="italic"
                textDecoration="underline"
            >
                Styled
            </Text>
        );
        const p = container.querySelector("p");
        expect(p).toHaveClass("text--large");
        expect(p).toHaveClass("text--secondary");
        expect(p).toHaveClass("text--bold");
        expect(p).toHaveClass("text--center");
        expect(p).toHaveClass("text--uppercase");
        expect(p).toHaveClass("text--italic");
        expect(p).toHaveClass("text--underline");
    });

    it("does not add fontStyle or textDecoration class if set to default", () => {
        const { container } = render(
            <Text fontStyle="normal" textDecoration="none">Defaults</Text>
        );
        const p = container.querySelector("p");
        expect(p).not.toHaveClass("text--italic");
        expect(p).not.toHaveClass("text--underline");
        expect(p).not.toHaveClass("text--overline");
        expect(p).not.toHaveClass("text--line-through");
    });
});