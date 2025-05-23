import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import DropboxUpload from "./DropboxUpload";

// Mock dependencies
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock("../Button/Button", () => ({
    default: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}));
vi.mock("./DropboxUpload.scss", () => ({}));
const showSnackbar = vi.fn();
vi.mock("~/context/ThemeContext", () => ({
    useTheme: () => ({
        showSnackbar,
    }),
}));

// Helper for global Dropbox mock
const chooseMock = vi.fn();
beforeEach(() => {
    // @ts-ignore
    global.window.Dropbox = { choose: chooseMock };
    chooseMock.mockClear();
    showSnackbar.mockClear();
});
afterEach(() => {
    // @ts-ignore
    delete global.window.Dropbox;
});

describe("DropboxUpload", () => {
    it("renders the button with correct props", () => {
        render(
            <DropboxUpload
                sourceFormat="jpeg"
                isDisabled={false}
                addFiles={vi.fn()}
            />
        );
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
        expect(screen.getByAltText("dropboxModal.accessibility.dropboxLogo")).toBeInTheDocument();
    });

    it("calls Dropbox.choose with correct options on click", () => {
        render(
            <DropboxUpload
                sourceFormat="gif"
                isDisabled={false}
                addFiles={vi.fn()}
            />
        );
        fireEvent.click(screen.getByRole("button"));
        expect(chooseMock).toHaveBeenCalledTimes(1);
        const options = chooseMock.mock.calls[0][0];
        expect(options.linkType).toBe("direct");
        expect(options.multiselect).toBe(true);
        expect(options.folderselect).toBe(false);
        expect(options.extensions).toEqual([".gif"]);
        expect(typeof options.success).toBe("function");
        expect(typeof options.cancel).toBe("function");
        expect(typeof options.error).toBe("function");
    });

    it("shows snackbar on cancel", () => {
        render(
            <DropboxUpload
                sourceFormat="png"
                isDisabled={false}
                addFiles={vi.fn()}
            />
        );
        fireEvent.click(screen.getByRole("button"));
        const options = chooseMock.mock.calls[0][0];
        options.cancel();
        expect(showSnackbar).toHaveBeenCalledWith(
            "dropboxModal.messages.operationCancelled",
            "info"
        );
    });

    it("shows snackbar on error", () => {
        render(
            <DropboxUpload
                sourceFormat="png"
                isDisabled={false}
                addFiles={vi.fn()}
            />
        );
        fireEvent.click(screen.getByRole("button"));
        const options = chooseMock.mock.calls[0][0];
        options.error();
        expect(showSnackbar).toHaveBeenCalledWith(
            "dropboxModal.errors.downloadError",
            "error"
        );
    });

    it("calls addFiles with converted files on success", async () => {
        const addFiles = vi.fn();
        render(
            <DropboxUpload
                sourceFormat="jpeg"
                isDisabled={false}
                addFiles={addFiles}
            />
        );
        // Mock fetch and File
        const blob = new Blob(["test"], { type: "image/jpeg" });
        global.fetch = vi.fn().mockResolvedValue({
            blob: () => Promise.resolve(blob),
        }) as any;

        const dropboxFile = {
            name: "test.jpg",
            link: "https://example.com/file.jpg",
            bytes: 123,
            icon: "",
            thumbnailLink: "",
            isDir: false,
        };
        fireEvent.click(screen.getByRole("button"));
        const options = chooseMock.mock.calls[0][0];
        await options.success([dropboxFile]);
        expect(addFiles).toHaveBeenCalledTimes(1);
        expect(addFiles.mock.calls[0][0][0]).toBeInstanceOf(File);
        expect(addFiles.mock.calls[0][0][0].name).toBe("test.jpg");
        expect(addFiles.mock.calls[0][0][0].type).toBe("image/jpeg");
        // @ts-ignore
        global.fetch.mockRestore?.();
    });

    it("shows snackbar if file download fails", async () => {
        render(
            <DropboxUpload
                sourceFormat="jpeg"
                isDisabled={false}
                addFiles={vi.fn()}
            />
        );
        global.fetch = vi.fn().mockRejectedValue(new Error("fail")) as any;
        const dropboxFile = {
            name: "fail.jpg",
            link: "https://example.com/fail.jpg",
            bytes: 123,
            icon: "",
            thumbnailLink: "",
            isDir: false,
        };
        fireEvent.click(screen.getByRole("button"));
        const options = chooseMock.mock.calls[0][0];
        await options.success([dropboxFile]);
        expect(showSnackbar).toHaveBeenCalledWith(
            "dropboxModal.errors.downloadError",
            "error"
        );
        // @ts-ignore
        global.fetch.mockRestore?.();
    });
});