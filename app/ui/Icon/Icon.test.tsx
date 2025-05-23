import React from "react";
import { render } from "@testing-library/react";
import Icon, { IconType } from "./Icon";

describe("Icon component", () => {
    it("renders with default props", () => {
        const { container, getByText } = render(<Icon icon="home" />);
        const iconElement = getByText("home");
        expect(iconElement).toBeInTheDocument();
        expect(iconElement.tagName).toBe("I");
        expect(iconElement).toHaveClass("material-icons");
        expect(iconElement).toHaveClass("icon");
        expect(iconElement).toHaveClass("icon--primary");
        expect(iconElement).toHaveClass("icon--medium");
    });

    it("renders with custom size and color", () => {
        const { getByText } = render(
            <Icon icon="settings" size="large" color="danger" />
        );
        const iconElement = getByText("settings");
        expect(iconElement).toHaveClass("icon--danger");
        expect(iconElement).toHaveClass("icon--large");
    });

    it("renders with all size and color variants", () => {
        const sizes = [
            "xxsmall",
            "xsmall",
            "small",
            "medium",
            "large",
            "xlarge",
        ] as const;
        const colors = [
            "primary",
            "secondary",
            "success",
            "danger",
            "warning",
            "info",
            "light",
            "dark",
            "white",
        ] as const;

        sizes.forEach((size) => {
            colors.forEach((color) => {
                const { getByText, unmount } = render(
                    <Icon icon="star" size={size} color={color} />
                );
                const iconElement = getByText("star");
                expect(iconElement).toHaveClass(`icon--${size}`);
                expect(iconElement).toHaveClass(`icon--${color}`);
                unmount();
            });
        });
    });

    it("renders the correct icon text", () => {
        const iconName: IconType = "favorite";
        const { getByText } = render(<Icon icon={iconName} />);
        expect(getByText(iconName)).toBeInTheDocument();
    });
});