import React, { forwardRef, useState } from 'react';
import InputText, { InputTextRef, InputTextProps } from '../InputText/InputText';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const InputPhone = forwardRef<InputTextRef, Omit<InputTextProps, 'type'>>((props, ref) => {
  const [error, setError] = useState<string | null>(null);

  const validatePhoneFormat = (value: string) => {
    const isValid = phoneRegex.test(value);
    setError(isValid ? null : 'Invalid phone number');
    return isValid;
  };

  return <InputText ref={ref} type="tel" validateFormat={validatePhoneFormat} error={error} {...props} />;
});

export default InputPhone;
