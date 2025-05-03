const inputs = [
    {
      id: "name",
      label: "contact.name",
      type: "text",
      size: { xs: 12 },
      className: 'u-pt2',

      isLabelVisible: false,
      placeholder: "contact.name",
    },
    {
      id: "phone",
      label: "contact.phone",
      size: { xs: 12 },
      type: "phone",
      isLabelVisible: false,
      placeholder: "contact.phone",
    },
    {
      id: "email",
      label: "contact.email",
      type: "email",
      size: { xs: 12 },

      isLabelVisible: false,
      placeholder: "contact.email",
    },
    {
      id: "comments",
      label: "contact.comments",
      size: { xs: 12 },
      type: "area",
      isLabelVisible: false,
      placeholder: "contact.comments",
    },
  ];
  
export const GET_IN_TOUCH_FORM = {
    type: "post",
    inputs,
    hasSubmit: true,
    submitAppareance: 'primary',
    buttonLabel: "contact.send",
  };