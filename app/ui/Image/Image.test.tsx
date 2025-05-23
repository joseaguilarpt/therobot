import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ImageComponent from "./Image";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

// Mock LoadingSpinner to avoid dependency on its implementation
vi.mock("../LoadingSpinner/LoadingSpinner", () => ({
    default: ({ size }: { size: string }) => <div data-testid="spinner">{size}</div>,
}));

describe("ImageComponent", () => {
    const src = "test-image.jpg";
    const alt = "Test image";

    it("renders the image with correct src and alt", () => {
        render(<ImageComponent src={src} alt={alt} />);
        const img = screen.getByAltText(alt) as HTMLImageElement;
        expect(img).toBeInTheDocument();
        expect(img.src).toContain(src);
        expect(img.alt).toBe(alt);
    });

    it("shows the loading spinner initially", () => {
        render(<ImageComponent src={src} alt={alt} />);
        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("removes the loading spinner after image loads", () => {
        render(<ImageComponent src={src} alt={alt} />);
        const img = screen.getByAltText(alt);
        act(() => {
            fireEvent.load(img);
        });
        expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });

    it("shows fallback message on image error", () => {
        render(<ImageComponent src={src} alt={alt} />);
        const img = screen.getByAltText(alt);
        act(() => {
            fireEvent.error(img);
        });
        expect(screen.getByText(/failed to load image/i)).toBeInTheDocument();
        expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });

    it("sets loading attribute according to prop", () => {
        render(<ImageComponent src={src} alt={alt} imageLoading="lazy" />);
        const img = screen.getByAltText(alt);
        expect(img).toHaveAttribute("loading", "lazy");
    });

});