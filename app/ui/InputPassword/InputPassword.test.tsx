import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import PasswordInput, { PasswordInputProps } from "./InputPassword";

// Mock dependencies
vi.mock("../InputText/InputText", () => ({
    __esModule: true,
    default: React.forwardRef((props: any, ref) => (
        <input ref={ref} data-testid="input-text" {...props} />
    )),
}));
vi.mock("../Icon/Icon", () => ({
    __esModule: true,
    default: (props: any) => <span data-testid={`icon-${props.icon}`} />,
}));
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("PasswordInput", () => {
    it("renders input of type password by default", () => {
        const { getByTestId } = render(<PasswordInput />);
        const input = getByTestId("input-text") as HTMLInputElement;
        expect(input.type).toBe("password");
    });

    it("shows toggle button when showPasswordToggle is true", () => {
        const { getByRole } = render(<PasswordInput />);
        expect(getByRole("button", { name: "Show password" })).toBeInTheDocument();
    });

    it("does not show toggle button when showPasswordToggle is false", () => {
        const { queryByRole } = render(<PasswordInput showPasswordToggle={false} />);
        expect(queryByRole("button")).toBeNull();
    });

    it("toggles password visibility when button is clicked", () => {
        const { getByTestId, getByRole } = render(<PasswordInput />);
        const input = getByTestId("input-text") as HTMLInputElement;
        const button = getByRole("button");

        // Initially password hidden
        expect(input.type).toBe("password");
        expect(button).toHaveAttribute("aria-label", "Show password");
        expect(getByTestId("icon-visibility")).toBeInTheDocument();

        // Click to show password
        fireEvent.click(button);
        expect(input.type).toBe("text");
        expect(button).toHaveAttribute("aria-label", "Hide password");
        expect(getByTestId("icon-visibility_off")).toBeInTheDocument();

        // Click again to hide password
        fireEvent.click(button);
        expect(input.type).toBe("password");
        expect(button).toHaveAttribute("aria-label", "Show password");
        expect(getByTestId("icon-visibility")).toBeInTheDocument();
    });

    it("forwards props to InputText", () => {
        const { getByTestId } = render(
            <PasswordInput name="my-password" placeholder="Enter password" />
        );
        const input = getByTestId("input-text") as HTMLInputElement;
        expect(input.name).toBe("my-password");
        expect(input.placeholder).toBe("Enter password");
    });
});