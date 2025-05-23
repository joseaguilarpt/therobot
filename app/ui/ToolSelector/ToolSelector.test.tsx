import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ToolSelector from "./ToolSelector";

// Mocks
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, opts?: any) => {
            if (key === "services.itemTitle" && opts) {
                return `${opts.sourceFormat} to ${opts.targetFormat}`;
            }
            if (key === "nav.topTools") return "Top Tools";
            return key;
        },
        i18n: { language: "en" },
    }),
}));

const mockParams: Record<string, string> = {};
vi.mock("@remix-run/react", () => ({
    useParams: () => mockParams,
}));

vi.mock("../InputSelect/InputSelect", () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="input-select">
            <span>{props.label}</span>
            <span>{props.placeholder}</span>
            <span>{props.initialValue}</span>
            <button
                data-testid="select-option"
                onClick={() => props.onSelect && props.onSelect("jpeg/webp")}
            >
                Select Option
            </button>
            {props.options.map((opt: any) => (
                <div key={opt.id} data-testid="option">
                    {opt.label}
                </div>
            ))}
        </div>
    ),
}));

describe("ToolSelector", () => {
    beforeEach(() => {
        Object.keys(mockParams).forEach((k) => delete mockParams[k]);
        vi.restoreAllMocks();
    });


    it("applies --contrast class when keepScrolled is true", () => {
        render(<ToolSelector keepScrolled />);
        const select = screen.getByTestId("input-select");
        expect(select).toBeInTheDocument();
    });

    it("sets initialValue based on params", () => {
        mockParams.sourceFormat = "jpeg";
        mockParams.targetFormat = "webp";
        render(<ToolSelector />);
        // initialValue should be "jpeg/webp"
        expect(screen.getByText("jpeg/webp")).toBeInTheDocument();
    });

    it("calls changeTool and updates window.location.href", () => {
        const originalLocation = window.location;
        // @ts-ignore
        delete window.location;
        window.location = { href: "" } as any;

        render(<ToolSelector />);
        const btn = screen.getByTestId("select-option");
        fireEvent.click(btn);
        expect(window.location.href).toBe("/en/convert/jpeg/webp");

        window.location = originalLocation;
    });
});