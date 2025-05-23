import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ButtonGroup, { ButtonOption } from "./ButtonGroup";

// Mock i18next translation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (str: string) => str,
    }),
}));

const options: ButtonOption[] = [
    { id: "one", label: "Option One" },
    { id: "two", label: "Option Two" },
];

describe("ButtonGroup", () => {
    it("renders all options", () => {
        const { getByText } = render(
            <ButtonGroup id="test-group" options={options} />
        );
        expect(getByText("Option One")).toBeInTheDocument();
        expect(getByText("Option Two")).toBeInTheDocument();
    });

    it("renders label when isLabelVisible is true", () => {
        const { getByText } = render(
            <ButtonGroup id="test-group" options={options} label="Test Label" isLabelVisible />
        );
        expect(getByText("Test Label")).toBeInTheDocument();
    });

    it("does not render label when isLabelVisible is false", () => {
        const { queryByText } = render(
            <ButtonGroup id="test-group" options={options} label="Test Label" isLabelVisible={false} />
        );
        expect(queryByText("Test Label")).not.toBeInTheDocument();
    });

    it("calls onChange when an option is clicked (controlled)", () => {
        const handleChange = vi.fn();
        const { getByLabelText } = render(
            <ButtonGroup
                id="test-group"
                options={options}
                selectedValue="one"
                onChange={handleChange}
            />
        );
        fireEvent.click(getByLabelText("Option Two"));
        expect(handleChange).toHaveBeenCalledWith("two");
    });

    it("updates selection internally when uncontrolled", () => {
        const { getByLabelText } = render(
            <ButtonGroup
                id="test-group"
                options={options}
                defaultSelectedValue="one"
            />
        );
        const optionTwo = getByLabelText("Option Two") as HTMLInputElement;
        expect((getByLabelText("Option One") as HTMLInputElement).checked).toBe(true);
        fireEvent.click(optionTwo);
        expect(optionTwo.checked).toBe(true);
    });

    it("applies active class to selected option", () => {
        const { container } = render(
            <ButtonGroup
                id="test-group"
                options={options}
                selectedValue="two"
            />
        );
        const activeButton = container.querySelector(".button-group__button--active");
        expect(activeButton).toHaveTextContent("Option Two");
    });

    it("passes className to root element", () => {
        const { container } = render(
            <ButtonGroup id="test-group" options={options} className="custom-class" />
        );
        expect(container.firstChild).toHaveClass("custom-class");
    });

    it("sets aria attributes correctly", () => {
        const { getByRole } = render(
            <ButtonGroup id="test-group" options={options} label="Test Label" />
        );
        const group = getByRole("group");
        expect(group).toHaveAttribute("aria-labelledby", "test-group-label");
    });


});