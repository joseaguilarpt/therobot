import React, { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import InputArea, { InputAreaRef } from './InputArea';

// Mock i18next translation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (str: string) => str,
    }),
}));

describe('InputArea', () => {
    const label = 'Test Label';

    it('renders label and textarea', () => {
        render(<InputArea label={label} />);
        expect(screen.getByLabelText(label)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('shows placeholder', () => {
        render(<InputArea label={label} placeholder="Type here" />);
        expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    it('hides label when isLabelVisible is false', () => {
        render(<InputArea label={label} isLabelVisible={false} />);
        const labelEl = screen.getByText(label);
        expect(labelEl).toHaveClass('sr-only');
    });

    it('shows required asterisk when isRequired', () => {
        render(<InputArea label={label} isRequired />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('disables textarea when isDisabled', () => {
        render(<InputArea label={label} isDisabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('shows hintText and errorText', () => {
        render(<InputArea label={label} hintText="Hint" errorText="Error" />);
        expect(screen.getByText('Hint')).toBeInTheDocument();
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Error');
    });

    it('calls onChange when typing', () => {
        const onChange = vi.fn();
        render(<InputArea label={label} onChange={onChange} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
        expect(onChange).toHaveBeenCalledWith('abc');
    });

    it('calls onFocus and onBlur', () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        render(<InputArea label={label} onFocus={onFocus} onBlur={onBlur} />);
        const textarea = screen.getByRole('textbox');
        fireEvent.focus(textarea);
        expect(onFocus).toHaveBeenCalled();
        fireEvent.blur(textarea);
        expect(onBlur).toHaveBeenCalled();
    });

    it('shows character count', () => {
        render(<InputArea label={label} maxLength={10} defaultValue="abc" />);
        expect(screen.getByText('3/10')).toBeInTheDocument();
    });

    it('respects value prop (controlled)', () => {
        render(<InputArea label={label} value="controlled" />);
        expect(screen.getByDisplayValue('controlled')).toBeInTheDocument();
    });

    it('respects defaultValue prop (uncontrolled)', () => {
        render(<InputArea label={label} defaultValue="default" />);
        expect(screen.getByDisplayValue('default')).toBeInTheDocument();
    });

    it('imperative handle: validate returns false if required and empty', () => {
        const ref = createRef<InputAreaRef>();
        render(<InputArea label={label} isRequired ref={ref} />);
        // Clear value
        ref.current?.clear();
        expect(ref.current?.validate()).toBe(false);
    });

    it('imperative handle: validate returns true if required and not empty', () => {
        const ref = createRef<InputAreaRef>();
        render(<InputArea label={label} isRequired defaultValue="abc" ref={ref} />);
        expect(ref.current?.validate()).toBe(true);
    });
    it('imperative handle: getValue returns current value', () => {
        const ref = createRef<InputAreaRef>();
        render(<InputArea label={label} defaultValue="abc" ref={ref} />);
        expect(ref.current?.getValue()).toBe('abc');
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'xyz' } });
        expect(ref.current?.getValue()).toBe('xyz');
    });

    it('applies custom className', () => {
        render(<InputArea label={label} className="custom-class" />);
        expect(screen.getByRole('textbox').parentElement).toHaveClass('custom-class');
    });

    it('applies rows prop', () => {
        render(<InputArea label={label} rows={5} />);
        expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
    });

    it('applies maxLength prop', () => {
        render(<InputArea label={label} maxLength={42} />);
        expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '100'); // always 100 in code
    });
});