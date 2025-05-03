import { useTranslation } from "react-i18next";
import GridContainer from "../../Grid/Grid";
import Text from "../../Text/Text";

export default function Editor({
  data,
}: {
  data: { editor: string; date: string; readTime: number };
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

/*
  "de": {
    "finance": "finanzen",
    "organization": "organisation",
    "decisionMaking": "entscheidungsfindung",
    "design": "design",
    "approval": "genehmigung",
    "ranking": "rangfolge",
    "share": "Teilen",
    "shareInFacebook": "Auf Facebook teilen",
    "shareInTwitter": "Auf Twitter teilen",
    "shareInWhatsapp": "Auf WhatsApp teilen",
    "shareInLinkedin": "Auf LinkedIn teilen",
    "minsRead": "Min Lesezeit",
    "seniorTechnicalEditor": "Leitender Technischer Redakteur",
    "relatedPosts": "Ähnliche Beiträge",
    "manuelGomezBio": "Manuel Gomez ist ein leidenschaftlicher Webentwickler und Enthusiast für Bildoptimierung. Mit über einem Jahrzehnt Erfahrung in der Erstellung schöner, leistungsfähiger Websites teilt Manuel gerne sein Wissen, um anderen zu helfen, bessere Web-Erlebnisse zu schaffen. Wenn er nicht gerade in die neuesten Webtechnologien eintaucht, experimentiert er mit Fotografie und erkundet die Natur",
    "latestPosts": "Neueste Beiträge",
    "latestPostsDescription": "Entdecken Sie unsere aktuellsten Artikel und bleiben Sie auf dem Laufenden"
  }, */