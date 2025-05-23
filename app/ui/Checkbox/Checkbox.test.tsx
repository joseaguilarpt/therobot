import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
    const baseProps = {
        id: 'test',
        name: 'test-checkbox',
        label: 'Test Checkbox',
    };

    it('renders with label', () => {
        const { getByLabelText } = render(<Checkbox {...baseProps} />);
        expect(getByLabelText('Test Checkbox')).toBeInTheDocument();
    });

    it('renders without label when hideLabel is true', () => {
        const { queryByText, getByRole } = render(
            <Checkbox {...baseProps} hideLabel ariaLabel="Hidden Label" />
        );
        expect(queryByText('Test Checkbox')).not.toBeInTheDocument();
        expect(getByRole('checkbox').getAttribute('aria-label')).toBe('Test Checkbox');
    });

    it('calls onChange when clicked (controlled)', () => {
        const handleChange = vi.fn();
        const { getByRole } = render(
            <Checkbox {...baseProps} checked={false} onChange={handleChange} />
        );
        fireEvent.click(getByRole('checkbox'));
        expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('toggles checked state when uncontrolled', () => {
        const { getByRole } = render(
            <Checkbox {...baseProps} defaultChecked={false} />
        );
        const checkbox = getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
    });

    it('is disabled when disabled prop is true', () => {
        const { getByRole } = render(
            <Checkbox {...baseProps} disabled />
        );
        expect(getByRole('checkbox')).toBeDisabled();
    });

    it('shows required indicator and sets aria-required', () => {
        const { getByText, getByRole } = render(
            <Checkbox {...baseProps} required />
        );
        expect(getByText('(required)')).toBeInTheDocument();
        expect(getByRole('checkbox').getAttribute('aria-required')).toBe('true');
    });

    it('shows error message and sets aria attributes', () => {
        const error = 'This is an error';
        const { getByText, getByRole } = render(
            <Checkbox {...baseProps} error={error} />
        );
        const errorMsg = getByText(error);
        expect(errorMsg).toBeInTheDocument();
        expect(errorMsg.getAttribute('role')).toBe('alert');
        expect(getByRole('checkbox').getAttribute('aria-invalid')).toBe('true');
        expect(getByRole('checkbox').getAttribute('aria-describedby')).toBe(errorMsg.id);
    });

    it('applies correct class when disabled', () => {
        const { container } = render(
            <Checkbox {...baseProps} disabled />
        );
        expect(container.querySelector('.checkbox--disabled')).toBeInTheDocument();
    });
});