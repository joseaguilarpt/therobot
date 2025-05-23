import { render, screen } from "@testing-library/react";
import StatusBar from "./StatusBar";
import React from "react";

// Mock the useTranslation hook from react-i18next
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            // Simulate translation keys for testing
            const translations: Record<string, string> = {
                "fileActions.processing": "processing",
                "fileActions.success": "SUCCESS",
                "fileActions.failed": "FAILED",
            };
            return translations[key] || key;
        },
    }),
}));

// Mock the Text component
vi.mock("../Text/Text", () => ({
    default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe("StatusBar", () => {
    it("renders with default status and capitalizes label", () => {
        render(<StatusBar />);
        expect(screen.getByText("Processing")).toBeInTheDocument();
        const container = screen.getByText("Processing").closest("div");
        expect(container).toHaveClass("status-bar");
        expect(container).toHaveClass("processing");
    });

    it("renders with provided status and capitalizes label", () => {
        render(<StatusBar status="success" />);
        expect(screen.getByText("Success")).toBeInTheDocument();
        const container = screen.getByText("Success").closest("div");
        expect(container).toHaveClass("status-bar");
        expect(container).toHaveClass("success");
    });

    it("renders with another status and capitalizes label", () => {
        render(<StatusBar status="failed" />);
        expect(screen.getByText("Failed")).toBeInTheDocument();
        const container = screen.getByText("Failed").closest("div");
        expect(container).toHaveClass("status-bar");
        expect(container).toHaveClass("failed");
    });

    it("handles unknown status gracefully", () => {
        render(<StatusBar status="unknown" />);
        // Should capitalize the key itself if not found in translations
        expect(screen.getByText("Fileactions.unknown")).toBeInTheDocument();
        const container = screen.getByText("Fileactions.unknown").closest("div");
        expect(container).toHaveClass("status-bar");
        expect(container).toHaveClass("unknown");
    });
});