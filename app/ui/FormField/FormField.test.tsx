import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import FormField, { GetInTouchForm } from "./FormField";

// Mock child components
vi.mock("~/ui/Grid/Grid", () => ({
    __esModule: true,
    default: ({ children }: any) => <div data-testid="grid">{children}</div>,
}));
vi.mock("~/ui/Grid/GridItem", () => ({
    __esModule: true,
    default: ({ children, ...props }: any) => <div data-testid="grid-item" {...props}>{children}</div>,
}));
vi.mock("~/ui/InputText/InputText", () => ({
    __esModule: true,
    default: ({ value = "", onChange, ...props }: any) => (
        <input
            data-testid="input-text"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            {...props}
        />
    ),
}));
vi.mock("~/ui/InputArea/InputArea", () => ({
    __esModule: true,
    default: ({ value = "", onChange, ...props }: any) => (
        <textarea
            data-testid="input-area"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            {...props}
        />
    ),
}));
vi.mock("~/ui/Button/Button", () => ({
    __esModule: true,
    default: ({ children, onClick, ...props }: any) => (
        <button data-testid="button" onClick={onClick} {...props}>{children}</button>
    ),
}));
vi.mock("~/ui/ButtonGroup/ButtonGroup", () => ({
    __esModule: true,
    default: ({ options, selectedValue, onChange, ...props }: any) => (
        <div data-testid="button-group" {...props}>
            {options.map((opt: any) => (
                <button
                    key={opt.id}
                    data-testid={`radio-${opt.id}`}
                    aria-pressed={selectedValue === opt.id}
                    onClick={() => onChange(opt.id)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    ),
}));
vi.mock("../InputPhone/InputPhone", () => ({
    __esModule: true,
    default: ({ value = "", onChange, ...props }: any) => (
        <input
            data-testid="input-phone"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            {...props}
        />
    ),
}));
vi.mock("../InputEmail/InputEmail", () => ({
    __esModule: true,
    default: ({ value = "", onChange, ...props }: any) => (
        <input
            data-testid="input-email"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            {...props}
        />
    ),
}));
vi.mock("../AutoSuggest/AutoSuggest", () => ({
    __esModule: true,
    default: ({ value = "", onChange, ...props }: any) => (
        <input
            data-testid="input-autosuggest"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            {...props}
        />
    ),
}));
vi.mock("../InputPassword/InputPassword", () => ({
    __esModule: true,
    default: ({ value = "", onChange, ...props }: any) => (
        <input
            data-testid="input-password"
            type="password"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            {...props}
        />
    ),
}));
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("FormField", () => {
    it("renders text input and submits form", () => {
        const handleSubmit = vi.fn();
        render(
            <FormField
                type="post"
                inputs={[
                    {
                        id: "name",
                        type: "text",
                        label: "Name",
                        isLabelVisible: true,
                    },
                ]}
                hasSubmit={true}
                buttonLabel="submit"
                onSubmit={handleSubmit}
            />
        );
        const input = screen.getByTestId("input-text");
        fireEvent.change(input, { target: { value: "John" } });
        fireEvent.click(screen.getByTestId("button"));
        expect(handleSubmit).toHaveBeenCalledWith({ name: "John" });
    });

    it("renders number input", () => {
        render(
            <FormField
                inputs={[
                    {
                        id: "age",
                        type: "number",
                        label: "Age",
                        isLabelVisible: true,
                    },
                ]}
                hasSubmit={false}
            />
        );
        expect(screen.getByTestId("input-text")).toBeInTheDocument();
    });

    it("renders password input", () => {
        render(
            <FormField
                inputs={[
                    {
                        id: "pass",
                        type: "password",
                        label: "Password",
                        isLabelVisible: true,
                    },
                ]}
                hasSubmit={false}
            />
        );
        expect(screen.getByTestId("input-password")).toBeInTheDocument();
    });

    it("renders phone input", () => {
        render(
            <FormField
                inputs={[
                    {
                        id: "phone",
                        type: "phone",
                        label: "Phone",
                        isLabelVisible: true,
                    },
                ]}
                hasSubmit={false}
            />
        );
        expect(screen.getByTestId("input-phone")).toBeInTheDocument();
    });

    it("renders email input", () => {
        render(
            <FormField
                inputs={[
                    {
                        id: "email",
                        type: "email",
                        label: "Email",
                        isLabelVisible: true,
                    },
                ]}
                hasSubmit={false}
            />
        );
        expect(screen.getByTestId("input-email")).toBeInTheDocument();
    });

    it("renders area input", () => {
        render(
            <FormField
                inputs={[
                    {
                        id: "desc",
                        type: "area",
                        label: "Description",
                        isLabelVisible: true,
                    },
                ]}
                hasSubmit={false}
            />
        );
        expect(screen.getByTestId("input-area")).toBeInTheDocument();
    });

    it("renders radio input and handles change", () => {
        const handleChange = vi.fn();
        render(
            <FormField
                inputs={[
                    {
                        id: "gender",
                        type: "radio",
                        label: "Gender",
                        isLabelVisible: true,
                        options: [
                            { id: "m", label: "Male" },
                            { id: "f", label: "Female" },
                        ],
                        defaultSelectedOption: "m",
                        size: {},
                    },
                ]}
                hasSubmit={false}
                onChange={handleChange}
            />
        );
        fireEvent.click(screen.getByTestId("radio-f"));
        expect(handleChange).toHaveBeenCalledWith({ gender: "f" });
    });

    it("renders autosuggest input", () => {
        render(
            <FormField
                inputs={[
                    {
                        id: "city",
                        type: "autosuggest",
                        label: "City",
                        isLabelVisible: true,
                        options: [],
                        value: "",
                        size: {},
                    },
                ]}
                hasSubmit={false}
            />
        );
        expect(screen.getByTestId("input-autosuggest")).toBeInTheDocument();
    });

    it("applies initialValue", () => {
        render(
            <FormField
                inputs={[
                    {
                        id: "name",
                        type: "text",
                        label: "Name",
                        isLabelVisible: true,
                    },
                ]}
                initialValue={{ name: "Jane" }}
                hasSubmit={false}
            />
        );
        expect(screen.getByTestId("input-text")).toHaveValue("Jane");
    });

    it("does not render submit button if hasSubmit is false", () => {
        render(
            <FormField
                inputs={[
                    {
                        id: "name",
                        type: "text",
                        label: "Name",
                        isLabelVisible: true,
                    },
                ]}
                hasSubmit={false}
            />
        );
        expect(screen.queryByTestId("button")).not.toBeInTheDocument();
    });
});