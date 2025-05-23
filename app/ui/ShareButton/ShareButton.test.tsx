import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import ShareButton, { validateEmailFormat } from "./ShareButton";

// Mocks for dependencies
vi.mock("../Modal/Modal", () => ({
    default: ({ isOpen, onClose, children }: any) =>
        isOpen ? (
            <div data-testid="modal">
                <button data-testid="close-modal" onClick={onClose}>
                    Close
                </button>
                {children}
            </div>
        ) : null,
}));

vi.mock("../Button/Button", () => ({
    default: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    ),
}));

vi.mock("../InputText/InputText", () => ({
    default: ({ id, onChange, ...props }: any) => (
        <input
            data-testid={id}
            onChange={e => onChange(e.target.value)}
            {...props}
        />
    ),
}));
vi.mock("../ContactWhatsapp/ContactWhatsapp", () => ({
    default: ({ isDisabled, phoneNumber }: any) => (
        <button disabled={isDisabled} data-testid="whatsapp-btn">
            Whatsapp {phoneNumber}
        </button>
    ),
}));
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock("~/context/ThemeContext", () => ({
    useTheme: () => ({
        showSnackbar: vi.fn(),
    }),
}));

const files = [
    {
        fileName: "test.txt",
        fileSize: 123,
        fileUrl: new Blob(["test"]),
        status: "ready",
    },
];

describe("validateEmailFormat", () => {
    it("returns true for valid emails", () => {
        expect(validateEmailFormat("test@example.com")).toBe(true);
        expect(validateEmailFormat("foo.bar@baz.co")).toBe(true);
    });
    it("returns false for invalid emails", () => {
        expect(validateEmailFormat("test@.com")).toBe(false);
        expect(validateEmailFormat("test.com")).toBe(false);
        expect(validateEmailFormat("")).toBe(false);
    });
});

describe("ShareButton", () => {
    let onDownload: ReturnType<typeof vi.fn>;
    let onEmailShare: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onDownload = vi.fn();
        onEmailShare = vi.fn();
        vi.clearAllMocks();
    });

    it("renders Share button enabled when files exist", () => {
        render(
            <ShareButton files={files} onDownload={onDownload} onEmailShare={onEmailShare} />
        );
        expect(screen.getByText("Share")).toBeEnabled();
    });

    it("opens modal on Share button click", () => {
        render(
            <ShareButton files={files} onDownload={onDownload} onEmailShare={onEmailShare} />
        );
        fireEvent.click(screen.getByText("Share"));
        expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("closes modal on close button click", async () => {
        render(
            <ShareButton files={files} onDownload={onDownload} onEmailShare={onEmailShare} />
        );
        fireEvent.click(screen.getByText("Share"));
        fireEvent.click(screen.getByTestId("close-modal"));
        await waitFor(() => {
            expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
        });
    });

    it("calls onDownload when download button is clicked", () => {
        render(
            <ShareButton files={files} onDownload={onDownload} onEmailShare={onEmailShare} />
        );
        fireEvent.click(screen.getByText("Share"));
        fireEvent.click(screen.getByText("share.downloadZip"));
        expect(onDownload).toHaveBeenCalled();
    });

    it("enables Whatsapp button only when phone is entered", () => {
        render(
            <ShareButton files={files} onDownload={onDownload} onEmailShare={onEmailShare} />
        );
        fireEvent.click(screen.getByText("Share"));
        const whatsappBtn = screen.getByTestId("whatsapp-btn");
        expect(whatsappBtn).toBeDisabled();
        fireEvent.change(screen.getByTestId("phone"), { target: { value: "123456" } });
        expect(screen.getByTestId("whatsapp-btn")).toBeEnabled();
    });
});