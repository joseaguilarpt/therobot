import React from "react";
import { render, screen } from "@testing-library/react";
import Heading, { HeadingProps } from "./Heading";
import { describe, it, expect } from "vitest";

describe("Heading", () => {
    const defaultProps: HeadingProps = {
        level: 2,
        children: "Test Heading",
    };

    it("renders the correct heading tag based on level", () => {
        for (let level = 1; level <= 6; level++) {
            render(<Heading {...defaultProps} level={level as any}>{`Heading ${level}`}</Heading>);
            const heading = screen.getByText(`Heading ${level}`);
            expect(heading.tagName).toBe(`H${level}`);
        }
    });

    it("applies the correct appearance class", () => {
        render(<Heading {...defaultProps} appearance={3} />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveClass("heading--h3");
    });

    it("defaults to appearance 1 if not provided", () => {
        render(<Heading {...defaultProps} />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveClass("heading--h1");
    });

    it("applies color class if color prop is provided", () => {
        render(<Heading {...defaultProps} color="primary" />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveClass("heading--primary");
    });

    it("applies underline class if underline is true", () => {
        render(<Heading {...defaultProps} underline />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveClass("heading--underline");
    });

    it("applies align class if align is provided", () => {
        render(<Heading {...defaultProps} align="center" />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveClass("heading--center");
    });

    it("applies italic class if italic is true", () => {
        render(<Heading {...defaultProps} italic />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveClass("heading--italic");
    });

    it("applies type class if type is provided", () => {
        render(<Heading {...defaultProps} type="questrial" />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveClass("heading--questrial");
    });

    it("applies custom className if provided", () => {
        render(<Heading {...defaultProps} className="custom-class" />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveClass("custom-class");
    });

    it("sets the id and tabIndex if provided", () => {
        render(<Heading {...defaultProps} id="heading-id" tabIndex={2} />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveAttribute("id", "heading-id");
        expect(heading).toHaveAttribute("tabIndex", "2");
    });

    it("sets aria-level to the heading level", () => {
        render(<Heading {...defaultProps} level={4} />);
        const heading = screen.getByText("Test Heading");
        expect(heading).toHaveAttribute("aria-level", "4");
    });
});