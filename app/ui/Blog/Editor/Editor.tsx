import { useTranslation } from "react-i18next";
import GridContainer from "../../Grid/Grid";
import Text from "../../Text/Text";

export default function Editor({
  data,
}: {
  data: { editor: string; date: string; readTime: string };
}) {
  const { t } = useTranslation();
  return (
    <GridContainer>
      <Text transform="uppercase" size="small" textWeight="bold">
        {t('blog.by')}
      </Text>
      <Text
        transform="uppercase"
        size="small"
        className="u-pl1"
        color="tertiary"
        textWeight="bold"
      >
        {data.editor}{" "}
      </Text>
      <Text size="small" textWeight="bold" className="u-pl1">
        -
      </Text>
      <Text size="small" className="u-pl1" textWeight="bold">
        {data.date}
      </Text>
      <Text size="small" textWeight="bold" className="u-pl1">
        -
      </Text>
      <Text transform="uppercase" size="small" className="u-pl1" textWeight="bold">
        {data.readTime} {t('blog.minsRead')}
      </Text>
    </GridContainer>
  );
}
