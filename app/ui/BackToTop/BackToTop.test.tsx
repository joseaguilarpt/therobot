import { render, screen, fireEvent } from '@testing-library/react';
import BackToTop from "./BackToTop";
import { vi } from "vitest";

// Mock Icon component
vi.mock('../Icon/Icon', () => ({
    default: () => <span data-testid="icon" />
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('BackToTop', () => {
    beforeEach(() => {
        // Reset scroll position before each test
        Object.defineProperty(window, 'pageYOffset', {
            writable: true,
            configurable: true,
            value: 0,
        });
    });

    it('renders the button', () => {
        render(<BackToTop />);
        const button = screen.getByTestId('back-to-top');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('back-to-top');
        expect(button).not.toHaveClass('visible');
        expect(button).toHaveAttribute('aria-label', 'ui.backToTop');
        expect(button).toHaveAttribute('title', 'ui.backToTop');
        expect(button).toHaveAttribute('tabIndex', '-1');
        expect(screen.getByTestId('icon')).toBeInTheDocument();
        expect(screen.getByText('ui.backToTop')).toBeInTheDocument();
    });

    it('shows the button when scrolled down', () => {
        render(<BackToTop />);
        Object.defineProperty(window, 'pageYOffset', {
            writable: true,
            configurable: true,
            value: 350,
        });
        fireEvent.scroll(window);
        const button = screen.getByTestId('back-to-top');
        expect(button).toHaveClass('visible');
        expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('hides the button when scrolled up', () => {
        render(<BackToTop />);
        Object.defineProperty(window, 'pageYOffset', {
            writable: true,
            configurable: true,
            value: 350,
        });
        fireEvent.scroll(window);
        Object.defineProperty(window, 'pageYOffset', {
            writable: true,
            configurable: true,
            value: 0,
        });
        fireEvent.scroll(window);
        const button = screen.getByTestId('back-to-top');
        expect(button).not.toHaveClass('visible');
        expect(button).toHaveAttribute('tabIndex', '-1');
    });

    it('scrolls to top and focuses main-content on click', () => {
        render(<BackToTop />);
        // Make button visible
        Object.defineProperty(window, 'pageYOffset', {
            writable: true,
            configurable: true,
            value: 350,
        });
        fireEvent.scroll(window);

        // Mock scrollTo
        window.scrollTo = vi.fn();

        // Mock main-content
        const focusMock = vi.fn();
        const mainContent = document.createElement('div');
        mainContent.id = 'main-content';
        mainContent.focus = focusMock;
        document.body.appendChild(mainContent);

        const button = screen.getByTestId('back-to-top');
        fireEvent.click(button);

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
        expect(focusMock).toHaveBeenCalled();

        document.body.removeChild(mainContent);
    });

    it('focuses body if main-content is not found', () => {
        render(<BackToTop />);
        // Make button visible
        Object.defineProperty(window, 'pageYOffset', {
            writable: true,
            configurable: true,
            value: 350,
        });
        fireEvent.scroll(window);

        // Mock scrollTo
        window.scrollTo = vi.fn();

        // Mock body focus
        const bodyFocusMock = vi.fn();
        document.body.focus = bodyFocusMock;

        const button = screen.getByTestId('back-to-top');
        fireEvent.click(button);

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
        expect(bodyFocusMock).toHaveBeenCalled();
    });
});