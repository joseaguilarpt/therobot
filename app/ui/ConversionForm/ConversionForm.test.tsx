import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { ConversionForm } from "./ConversionForm";

// Mock child components

vi.mock("../AutoSuggest/AutoSuggest", () => ({
  default: (props: any) => (
    <input
      data-testid={`AutoSuggest-${props.id}`}
      value={props.value?.label || ""}
      onChange={(e) => props.onChange({ label: e.target.value })}
      aria-label={props.id}
    />
  ),
}));

vi.mock("../ButtonGroup/ButtonGroup", () => ({
  default: (props: any) => (
    <div data-testid="ButtonGroup">
      {props.options.map((opt: any) => (
        <button
          key={opt.id}
          data-testid={`ButtonGroup-${opt.id}`}
          onClick={() => props.onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));
vi.mock("../Button/Button", () => ({
  default: (props: any) => (
    <button
      data-testid="SwapButton"
      onClick={props.onClick}
      aria-label={props.ariaLabel}
    >
      {props.children}
    </button>
  ),
}));

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

const options = [
  { id: 1, label: "DOCX", value: "docx" },
  { id: 2, label: "PDF", value: "pdf" },
  { id: 3, label: "TXT", value: "txt" },
];

describe("ConversionForm", () => {
  let handleFromChange: any;
  let handleToChange: any;
  let handleSwap: any;
  let setPdfType: any;

  beforeEach(() => {
    handleFromChange = vi.fn();
    handleToChange = vi.fn();
    handleSwap = vi.fn();
    setPdfType = vi.fn();
  });

  it("renders AutoSuggest inputs with correct values", () => {
    render(
      <ConversionForm
        selectedFormat="PDF"
        selectedFormatFrom="DOCX"
        pdfType="single"
        setPdfType={setPdfType}
        handleFromChange={handleFromChange}
        handleToChange={handleToChange}
        handleSwap={handleSwap}
        options={options}
      />
    );
    expect(screen.getByTestId("AutoSuggest-from")).toHaveValue("DOCX");
    expect(screen.getByTestId("AutoSuggest-to")).toHaveValue("PDF");
  });

  it("calls handleFromChange and trackClick when from AutoSuggest changes", () => {
    render(
      <ConversionForm
        selectedFormat="PDF"
        selectedFormatFrom="DOCX"
        pdfType="single"
        setPdfType={setPdfType}
        handleFromChange={handleFromChange}
        handleToChange={handleToChange}
        handleSwap={handleSwap}
        options={options}
      />
    );
    fireEvent.change(screen.getByTestId("AutoSuggest-from"), {
      target: { value: "TXT" },
    });
    expect(handleFromChange).toHaveBeenCalledWith("TXT");
  });

  it("calls handleToChange and trackClick when to AutoSuggest changes", () => {
    render(
      <ConversionForm
        selectedFormat="PDF"
        selectedFormatFrom="DOCX"
        pdfType="single"
        setPdfType={setPdfType}
        handleFromChange={handleFromChange}
        handleToChange={handleToChange}
        handleSwap={handleSwap}
        options={options}
      />
    );
    fireEvent.change(screen.getByTestId("AutoSuggest-to"), {
      target: { value: "TXT" },
    });
    expect(handleToChange).toHaveBeenCalledWith("TXT");
  });

  it("calls handleSwap when swap button is clicked", () => {
    render(
      <ConversionForm
        selectedFormat="PDF"
        selectedFormatFrom="DOCX"
        pdfType="single"
        setPdfType={setPdfType}
        handleFromChange={handleFromChange}
        handleToChange={handleToChange}
        handleSwap={handleSwap}
        options={options}
      />
    );
    fireEvent.click(screen.getByTestId("SwapButton"));
    expect(handleSwap).toHaveBeenCalled();
  });

  it("renders PDF options when selectedFormat is PDF", () => {
    render(
      <ConversionForm
        selectedFormat="PDF"
        selectedFormatFrom="DOCX"
        pdfType="single"
        setPdfType={setPdfType}
        handleFromChange={handleFromChange}
        handleToChange={handleToChange}
        handleSwap={handleSwap}
        options={options}
      />
    );
    expect(screen.getByTestId("ButtonGroup")).toBeInTheDocument();
    expect(screen.getByText("tool.selectOption")).toBeInTheDocument();
  });

  it("does not render PDF options when selectedFormat is not PDF", () => {
    render(
      <ConversionForm
        selectedFormat="DOCX"
        selectedFormatFrom="PDF"
        pdfType="single"
        setPdfType={setPdfType}
        handleFromChange={handleFromChange}
        handleToChange={handleToChange}
        handleSwap={handleSwap}
        options={options}
      />
    );
    expect(screen.queryByTestId("ButtonGroup")).not.toBeInTheDocument();
    expect(screen.queryByText("tool.selectOption")).not.toBeInTheDocument();
  });

  it("calls setPdfType when a PDF option is clicked", () => {
    render(
      <ConversionForm
        selectedFormat="PDF"
        selectedFormatFrom="DOCX"
        pdfType="single"
        setPdfType={setPdfType}
        handleFromChange={handleFromChange}
        handleToChange={handleToChange}
        handleSwap={handleSwap}
        options={options}
      />
    );
    fireEvent.click(screen.getByTestId("ButtonGroup-separated"));
    expect(setPdfType).toHaveBeenCalledWith("separated");
    fireEvent.click(screen.getByTestId("ButtonGroup-single"));
    expect(setPdfType).toHaveBeenCalledWith("single");
  });
});
