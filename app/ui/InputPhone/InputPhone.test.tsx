import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import InputPhone from './InputPhone';

// Mock InputText to observe props and simulate behavior
vi.mock('../InputText/InputText', () => {
    return {
        __esModule: true,
        default: vi.fn(({ validateFormat, error, ...props }) => (
            <div>
                <input
                    data-testid="input"
                    onChange={e => {
                        validateFormat?.(e.target.value);
                        props.onChange?.(e);
                    }}
                />
                {error && <span data-testid="error">{error}</span>}
            </div>
        )),
    };
});

describe('InputPhone', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without error initially', () => {
        render(<InputPhone />);
        expect(screen.queryByTestId('error')).toBeNull();
    });

    it('accepts a valid phone number', () => {
        render(<InputPhone />);
        const input = screen.getByTestId('input') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '+1234567890' } });
        expect(screen.queryByTestId('error')).toBeNull();
    });

    it('shows error for invalid phone number', () => {
        render(<InputPhone />);
        const input = screen.getByTestId('input') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'abc123' } });
        expect(screen.getByTestId('error').textContent).toBe('Invalid phone number');
    });

    it('forwards other props to InputText', () => {
        const onChange = vi.fn();
        render(<InputPhone onChange={onChange} />);
        const input = screen.getByTestId('input') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '+1234567890' } });
        expect(onChange).toHaveBeenCalled();
    });
});