import { useTranslation } from "react-i18next";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import Heading from "../Heading/Heading";
import Text from "../Text/Text";
import Box from "../Box/Box";
import FormField from "../FormField/FormField";
import { GET_IN_TOUCH_FORM } from "~/constants/getInTouchForm";
import { useForm } from "~/hooks/useForm";

export default function ContactForm({
  data,
}: {
  data: { contactError: boolean; contactEmailSent: boolean };
}) {
  const { t } = useTranslation();
  const params = GET_IN_TOUCH_FORM;
  const formId = "get-in-touch-form";

  const { onFormSubmit, contactFormData, setContactForm, isPending } =
    useForm(data);

  return (
    <GridContainer alignItems="center" className="u-mt3 u-mb6">
      <GridItem xs={12} lg={6}>
        <Heading align="left" level={1} appearance={4} underline>
          {t("contact.heading")}
        </Heading>
        <div className="u-pt2 u-pr4">
          <Text>{t("contact.description")}</Text>
          <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
            {t("contact.inquiries")}
          </Heading>

          <Text>{t("email")}: admin@easyconvertimage.com</Text>

          <Heading className="u-pt3 u-pb1" level={2} appearance={5}>
            {t("contact.support")}
          </Heading>

          <Text>{t("email")}: admin@easyconvertimage.com</Text>
        </div>
      </GridItem>
      <GridItem xs={12} lg={6}>
        <Box>
          <div className="u-pt2 u-pb2">
            <Text size="small" color="secondary" textWeight="semi-bold">
              {t("contact.contactUs")}
            </Text>
            <div className="u-pt1 u-pb1">
              <Text size="small">{t("contact.instructions")}</Text>
              <FormField
                id={formId}
                isLoading={isPending}
                {...params}
                initialValue={contactFormData}
                onChange={setContactForm}
                onSubmit={onFormSubmit}
              />
            </div>
          </div>
        </Box>
      </GridItem>
    </GridContainer>
  );
}
