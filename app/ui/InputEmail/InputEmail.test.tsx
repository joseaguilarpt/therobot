import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import InputEmail from './InputEmail';

vi.mock('../InputText/InputText', () => {
    return {
        __esModule: true,
        default: vi.fn(({ validateFormat, error, ...props }) => (
            <div>
                <input
                    data-testid="input"
                    onChange={e => validateFormat?.(e.target.value)}
                    {...props}
                />
                {error && <span data-testid="error">{error}</span>}
            </div>
        )),
    };
});

describe('InputEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without error initially', () => {
        render(<InputEmail />);
        expect(screen.queryByTestId('error')).toBeNull();
    });

    it('accepts valid email and does not show error', () => {
        render(<InputEmail />);
        const input = screen.getByTestId('input') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        expect(screen.queryByTestId('error')).toBeNull();
    });

    it('shows error for invalid email', () => {
        render(<InputEmail />);
        const input = screen.getByTestId('input') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'invalid-email' } });
        expect(screen.getByTestId('error').textContent).toBe('Invalid email format');
    });

    it('forwards other props to InputText', () => {
        render(<InputEmail placeholder="Email here" />);
        const input = screen.getByTestId('input') as HTMLInputElement;
        expect(input).toHaveAttribute('placeholder', 'Email here');
    });
});