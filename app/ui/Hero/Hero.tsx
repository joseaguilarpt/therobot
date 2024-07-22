import "./Hero.scss";

import { ReactNode } from "react";
import ContentContainer from "../ContentContainer/ContentContainer";
import classNames from "classnames";

interface HeroType {
  children: ReactNode;
  background?: string;
  size?: "full" | "half";
}

export default function Hero({
  children,
  background,
  size = "full",
}: HeroType) {
  return (
    <div className={classNames("hero", background, size)}>
      <ContentContainer>{children}</ContentContainer>
    </div>
  );
}
