import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Files from "./Files";

// Mocks
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));
vi.mock("@remix-run/react", () => ({
  useParams: () => ({
    sourceFormat: "jpg",
    targetFormat: "png",
  }),
}));
vi.mock("../ShareButton/ShareButton", () => ({
  default: (props: any) => (
    <button onClick={() => props.onEmailShare("test@email.com")}>Share</button>
  ),
}));
vi.mock("../Modal/Modal", () => ({
  default: (props: any) =>
    props.isOpen ? (
      <div data-testid="modal">
        <button onClick={props.onClose}>Close</button>
        {props.children}
      </div>
    ) : null,
}));

vi.mock("~/context/ThemeContext", () => ({
  useTheme: () => ({
    showSnackbar: vi.fn(),
  }),
}));

const createFile = (name = "file1.png", size = 1024, status = "done") => {
  const blob = new Blob(["test"], { type: "image/png" });
  // @ts-ignore
  blob.arrayBuffer = () => Promise.resolve(new ArrayBuffer(8));
  return {
    fileName: name,
    fileSize: size,
    fileUrl: blob,
    status,
  };
};

describe("Files component", () => {
  let onDownload: any, onRemove: any, onRemoveAll: any, onEmailShare: any;

  beforeEach(() => {
    onDownload = vi.fn();
    onRemove = vi.fn();
    onRemoveAll = vi.fn();
    onEmailShare = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing if files is empty", () => {
    const { container } = render(
      <Files
        files={[]}
        onDownload={onDownload}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
        onEmailShare={onEmailShare}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders file list and actions", () => {
    render(
      <Files
        files={[createFile()]}
        onDownload={onDownload}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
        onEmailShare={onEmailShare}
      />
    );
    expect(screen.getByText("file1.png")).toBeInTheDocument();
    expect(screen.getByText("fileActions.downloadAll (1)")).toBeInTheDocument();
    expect(screen.getByText("fileActions.removeAll")).toBeInTheDocument();
    expect(screen.getByText("fileActions.download")).toBeInTheDocument();
    expect(screen.getByText("fileActions.remove")).toBeInTheDocument();
  });

  it("calls onDownload when download button is clicked", () => {
    render(
      <Files
        files={[createFile()]}
        onDownload={onDownload}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
        onEmailShare={onEmailShare}
      />
    );
    fireEvent.click(screen.getByText("fileActions.download"));
    expect(onDownload).toHaveBeenCalled();
  });

  it("calls onRemove when remove button is clicked", () => {
    render(
      <Files
        files={[createFile()]}
        onDownload={onDownload}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
        onEmailShare={onEmailShare}
      />
    );
    fireEvent.click(screen.getByText("fileActions.remove"));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it("calls onRemoveAll when remove all button is clicked", () => {
    render(
      <Files
        files={[createFile()]}
        onDownload={onDownload}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
        onEmailShare={onEmailShare}
      />
    );
    fireEvent.click(screen.getByText("fileActions.removeAll"));
    expect(onRemoveAll).toHaveBeenCalled();
  });

  it("calls onEmailShare when ShareButton is clicked", async () => {
    render(
      <Files
        files={[createFile()]}
        onDownload={onDownload}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
        onEmailShare={onEmailShare}
      />
    );
    fireEvent.click(screen.getByText("Share"));
    await waitFor(() => {
      expect(onEmailShare).toHaveBeenCalled();
    });
  });

  it("does not render download all or share if a file is processing", () => {
    render(
      <Files
        files={[createFile("file2.png", 1024, "processing")]}
        onDownload={onDownload}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
        onEmailShare={onEmailShare}
      />
    );
    expect(
      screen.queryByText("fileActions.downloadAll (1)")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Share")).not.toBeInTheDocument();
  });

  it("renders correct file size in kb", () => {
    render(
      <Files
        files={[createFile("file3.png", 2048)]}
        onDownload={onDownload}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
        onEmailShare={onEmailShare}
      />
    );
    expect(screen.getAllByText("2 kb").length).toBeGreaterThan(0);
  });
});
