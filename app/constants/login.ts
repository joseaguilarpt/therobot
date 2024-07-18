const inputs = [
    {
      id: "name",
      label: "login.name",
      type: "text",
      size: { xs: 12 },
      className: 'u-pt2',

      isLabelVisible: false,
      placeholder: "login.name",
    },
    {
      id: "password",
      label: "login.name",
      type: "password",
      size: { xs: 12 },
      className: 'u-pt2',

      isLabelVisible: false,
      placeholder: "login.password",
    },
  ];
  
export const LOGIN_FORM = {
    type: "post",
    inputs,
    hasSubmit: true,
    submitAppareance: 'primary',
    buttonLabel: "login.loginButton",
  };

  const resetInputs = [
    {
      id: "reset",
      label: "login.resetLabel",
      type: "email",
      size: { xs: 12 },
      className: 'u-pt2',

      isLabelVisible: false,
      placeholder: "login.resetLabel",
    },
    
  ];
  
export const RESET_FORM = {
    type: "post",
    inputs: resetInputs,
    hasSubmit: true,
    submitAppareance: 'primary',
    buttonLabel: "login.resetLabel",
  };