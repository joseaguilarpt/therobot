import "./InputPassword.scss";

import React, { forwardRef } from "react";
import InputText, {
  InputTextProps,
  InputTextRef,
} from "../InputText/InputText";
import Icon from "../Icon/Icon";
import { useTranslation } from "react-i18next";

export interface PasswordInputProps extends Omit<InputTextProps, "type"> {
  showPasswordToggle?: boolean;
}

const PasswordInput: React.ForwardRefRenderFunction<
  InputTextRef,
  PasswordInputProps
> = ({ showPasswordToggle = true, ...props }, ref) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="password-input">
      <InputText
        ref={ref}
        {...props}
        type={showPassword ? "text" : "password"}
      />
      {showPasswordToggle && (
        <button
          type="button"
          className="password-input__toggle-button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? t("Hide password") : t("Show password")}
        >
          {showPassword ? (
            <Icon size="small" icon="visibility_off" />
          ) : (
            <Icon size="small" icon="visibility" />
          )}
        </button>
      )}
    </div>
  );
};

export default forwardRef(PasswordInput);
