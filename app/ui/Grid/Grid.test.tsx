import React from "react";
import { render } from "@testing-library/react";
import GridContainer from "./Grid";
import { describe, it, expect } from "vitest";

describe("GridContainer", () => {
    it("renders children", () => {
        const { getByText } = render(
            <GridContainer>
                <span>Child</span>
            </GridContainer>
        );
        expect(getByText("Child")).toBeInTheDocument();
    });

    it("applies default classes", () => {
        const { container } = render(<GridContainer>Test</GridContainer>);
        const div = container.firstChild as HTMLElement;
        expect(div.className).toContain("grid-container");
        expect(div.className).toContain("flex-row");
        expect(div.className).toContain("justify-flex-start");
        expect(div.className).toContain("align-stretch");
        expect(div.className).toContain("content-stretch");
        expect(div.className).not.toContain("gap-");
    });

    it("applies custom class names", () => {
        const { container } = render(
            <GridContainer containerClassName="custom-container" className="custom-class" backgroundColorClass="bg-red">
                Test
            </GridContainer>
        );
        const div = container.firstChild as HTMLElement;
        expect(div.className).toContain("custom-container");
        expect(div.className).toContain("custom-class");
        expect(div.className).toContain("bg-red");
    });

    it("applies direction, justifyContent, alignItems, alignContent, and spacing", () => {
        const { container } = render(
            <GridContainer
                direction="column"
                justifyContent="center"
                alignItems="flex-end"
                alignContent="space-between"
                spacing={2}
            >
                Test
            </GridContainer>
        );
        const div = container.firstChild as HTMLElement;
        expect(div.className).toContain("flex-column");
        expect(div.className).toContain("justify-center");
        expect(div.className).toContain("align-flex-end");
        expect(div.className).toContain("content-space-between");
        expect(div.className).toContain("gap-2");
    });

    it("does not add gap class if spacing is 0", () => {
        const { container } = render(<GridContainer spacing={0}>Test</GridContainer>);
        const div = container.firstChild as HTMLElement;
        expect(div.className).not.toContain("gap-0");
    });

    it("sets the role attribute if provided", () => {
        const { container } = render(<GridContainer role="main">Test</GridContainer>);
        const div = container.firstChild as HTMLElement;
        expect(div.getAttribute("role")).toBe("main");
    });

    it("does not set the role attribute if not provided", () => {
        const { container } = render(<GridContainer>Test</GridContainer>);
        const div = container.firstChild as HTMLElement;
        expect(div.hasAttribute("role")).toBe(false);
    });


});