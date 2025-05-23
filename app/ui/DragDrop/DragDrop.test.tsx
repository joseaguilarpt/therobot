import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import DragAndDrop from "./DragDrop";

// Mocks for Remix, i18next, ThemeContext, GoogleReCaptcha, analytics, and children components
vi.mock("@remix-run/react", () => ({
    Form: (props: any) => <form {...props} />,
    useOutletContext: () => ({
        honeypotInputProps: {
            nameFieldName: "honeypot-name",
            validFromFieldName: "honeypot-valid",
        },
    }),
    useParams: () => ({
        sourceFormat: "png",
        targetFormat: "jpg",
    }),
}));
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: "en" },
    }),
}));
vi.mock("~/context/ThemeContext", () => ({
    useTheme: () => ({
        showSnackbar: vi.fn(),
    }),
}));
vi.mock("react-google-recaptcha-v3", () => ({
    useGoogleReCaptcha: () => ({
        executeRecaptcha: vi.fn().mockResolvedValue("recaptcha-token"),
    }),
}));
vi.mock("~/utils/analytics", () => ({
    trackClick: vi.fn(),
}));
vi.mock("../Button/Button", () => ({
    __esModule: true,
    default: (props: any) => <button {...props} />,
}));
vi.mock("../Icon/Icon", () => ({
    __esModule: true,
    default: (props: any) => <span data-testid="icon" {...props} />,
}));
vi.mock("../Divider/Divider", () => ({
    __esModule: true,
    default: (props: any) => <span data-testid="divider" {...props} />,
}));
vi.mock("../Text/Text", () => ({
    __esModule: true,
    default: (props: any) => <span data-testid="text" {...props} />,
}));
vi.mock("../Heading/Heading", () => ({
    __esModule: true,
    default: (props: any) => <h4 {...props} />,
}));
vi.mock("remix-utils/honeypot/react", () => ({
    HoneypotInputs: () => <div data-testid="honeypot" />,
}));
vi.mock("../LoadingSpinner/LoadingSpinner", () => ({
    __esModule: true,
    default: () => <span data-testid="spinner" />,
}));
vi.mock("../Grid/Grid", () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="grid" {...props} />,
}));
vi.mock("../DropboxUpload/DropboxUpload", () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="dropbox-upload" {...props} />,
}));
vi.mock("../Grid/GridItem", () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="grid-item" {...props} />,
}));
vi.mock("../GooglePicker/GooglePicker", () => ({
    GoogleDrivePicker: (props: any) => <div data-testid="google-picker" {...props} />,
}));

describe("DragAndDrop", () => {
    const onFilesDrop = vi.fn();
    const acceptedTypes = ["image/png", "image/jpeg"];
    const files: File[] = [];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading spinner when isLoading is true", () => {
        render(
            <DragAndDrop
                onFilesDrop={onFilesDrop}
                acceptedTypes={acceptedTypes}
                files={files}
                isLoading={true}
            />
        );
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
        expect(screen.getByText("fileActions.processing")).toBeInTheDocument();
    });

    it("calls addFiles when file input changes", async () => {
        render(
            <DragAndDrop
                onFilesDrop={onFilesDrop}
                acceptedTypes={acceptedTypes}
                files={files}
            />
        );
        const file = new File(["dummy"], "test.png", { type: "image/png" });
        const input = screen.getByLabelText("t.inputFile") as HTMLInputElement;
        await waitFor(() => {
            fireEvent.change(input, { target: { files: [file] } });
        });
        // Wait for async addFiles
        await waitFor(() => {
            expect(onFilesDrop).toHaveBeenCalled();
        });
    });

    it("handles drag and drop events", async () => {
        render(
            <DragAndDrop
                onFilesDrop={onFilesDrop}
                acceptedTypes={acceptedTypes}
                files={files}
            />
        );
        const dropZone = screen.getByLabelText("tool.fileArea");
        const file = new File(["dummy"], "test.png", { type: "image/png" });
        const data = {
            dataTransfer: {
                files: [file],
                items: [{ kind: "file" }],
            },
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
        };

        fireEvent.dragEnter(dropZone, data);
        expect(dropZone.className).toContain("dragging");

        fireEvent.dragOver(dropZone, data);
        fireEvent.drop(dropZone, data);

        await waitFor(() => {
            expect(onFilesDrop).toHaveBeenCalled();
        });
    });

    it("calls file input click when upload button is clicked", () => {
        render(
            <DragAndDrop
                onFilesDrop={onFilesDrop}
                acceptedTypes={acceptedTypes}
                files={files}
            />
        );
        const input = screen.getByLabelText("t.inputFile") as HTMLInputElement;
        const clickSpy = vi.spyOn(input, "click");
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(clickSpy).toHaveBeenCalled();
    });
});