import React from 'react';
import { render, screen } from '@testing-library/react';
import ScrollProgressBar from './ScrollProgressBar';
import { vi } from 'vitest';

describe('ScrollProgressBar', () => {
    const setScrollProps = ({
        scrollTop = 0,
        scrollHeight = 1000,
        clientHeight = 500,
    }) => {
        Object.defineProperty(document.documentElement, 'scrollTop', {
            configurable: true,
            value: scrollTop,
            writable: true,
        });
        Object.defineProperty(document.documentElement, 'scrollHeight', {
            configurable: true,
            value: scrollHeight,
            writable: true,
        });
        Object.defineProperty(document.documentElement, 'clientHeight', {
            configurable: true,
            value: clientHeight,
            writable: true,
        });
    };

    beforeEach(() => {
        setScrollProps({ scrollTop: 0, scrollHeight: 1000, clientHeight: 500 });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the progress bar', () => {
        render(<ScrollProgressBar />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows 0% progress at the top', () => {
        setScrollProps({ scrollTop: 0, scrollHeight: 1000, clientHeight: 500 });
        render(<ScrollProgressBar />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveStyle({ width: '0%' });
        expect(bar).toHaveAttribute('aria-valuenow', '0');
    });

    it('shows 100% progress at the bottom', () => {
        setScrollProps({ scrollTop: 500, scrollHeight: 1000, clientHeight: 500 });
        render(<ScrollProgressBar />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveStyle({ width: '100%' });
        expect(bar).toHaveAttribute('aria-valuenow', '100');
    });

    it('does not exceed 100% progress', () => {
        setScrollProps({ scrollTop: 1000, scrollHeight: 1000, clientHeight: 500 });
        render(<ScrollProgressBar />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveStyle({ width: '100%' });
        expect(bar).toHaveAttribute('aria-valuenow', '100');
    });

    it('has correct accessibility attributes', () => {
        render(<ScrollProgressBar />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
        expect(bar).toHaveAttribute('aria-label', 'Page scroll progress');
    });
});