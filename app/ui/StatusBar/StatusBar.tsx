import classNames from "classnames";
import "./StatusBar.scss";
import Text from "../Text/Text";
import { useTranslation } from "react-i18next";

export default function StatusBar({
  status = "processing",
}: {
  status: "completed" | "error" | "processing";
}) {
  const { t } = useTranslation();
  function capitalize(str: string): string {
    if (!str) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  const label = t(`fileActions.${status}`);
  return (
    <div className={classNames("status-bar", status)}>
      <Text size="small" textWeight="bold">
        {capitalize(label)}
      </Text>
    </div>
  );
}
