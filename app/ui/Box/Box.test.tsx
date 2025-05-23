import React from 'react';
import { render, screen } from '@testing-library/react';
import Box from './Box';

describe('Box', () => {
    it('renders children correctly', () => {
        render(
            <Box>
                <span>Test Content</span>
            </Box>
        );
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies the default className', () => {
        render(<Box>Content</Box>);
        const div = screen.getByTestId('box');
        expect(div).toHaveClass('box-container');
    });

    it('applies additional className when provided', () => {
        render(<Box className="custom-class">Content</Box>);
        const div = screen.getByTestId('box');
        expect(div).toHaveClass('box-container');
        expect(div).toHaveClass('custom-class');
    });
});