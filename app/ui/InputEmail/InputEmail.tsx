import React, { forwardRef, useState } from 'react';
import InputText, { InputTextRef, InputTextProps } from '../InputText/InputText';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InputEmail = forwardRef<InputTextRef, Omit<InputTextProps, 'type'>>((props, ref) => {
  const [error, setError] = useState<string | null>(null);

  const validateEmailFormat = (value: string) => {
    const isValid = emailRegex.test(value);
    setError(isValid ? null : 'Invalid email format');
    return isValid;
  };

  return <InputText ref={ref} type="email" validateFormat={validateEmailFormat} error={error} {...props} />;
});

export default InputEmail;
