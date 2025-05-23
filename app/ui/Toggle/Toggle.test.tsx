import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Toggle from './Toggle';

describe('Toggle', () => {
    it('renders checked state', () => {
        const { getByRole } = render(<Toggle checked={true} onChange={() => {}} />);
        const checkbox = getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    it('renders unchecked state', () => {
        const { getByRole } = render(<Toggle checked={false} onChange={() => {}} />);
        const checkbox = getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
    });

    it('calls onChange when clicked', () => {
        const onChange = vi.fn();
        const { getByRole } = render(<Toggle checked={false} onChange={onChange} />);
        const checkbox = getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalled();
    });

    it('sets aria-label when provided', () => {
        const { getByLabelText } = render(
            <Toggle checked={false} onChange={() => {}} ariaLabel="toggle me" />
        );
        expect(getByLabelText('toggle me')).toBeInTheDocument();
    });

    it('renders label when provided and hideLabel is false', () => {
        const { getByText } = render(
            <Toggle checked={false} onChange={() => {}} label="My Toggle" />
        );
        expect(getByText('My Toggle')).toBeInTheDocument();
    });

    it('does not render label when hideLabel is true', () => {
        const { queryByText } = render(
            <Toggle checked={false} onChange={() => {}} label="My Toggle" hideLabel />
        );
        expect(queryByText('My Toggle')).toBeNull();
    });
});