import './CookiesConsent.scss';

import { useState, useEffect } from "react";
import Text from "../Text/Text";
import Button from "../Button/Button";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import ContentContainer from "../ContentContainer/ContentContainer";

function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (cookiesAccepted !== "true") {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookies-banner">
      <ContentContainer>
        <Text size="large" align="center">
          Easy Convert Image uses cookies to enhance your experience. By
          continuing to use our site, you agree to our use of cookies.
        </Text>
        <GridContainer className="u-pt2" justifyContent="center">
          <GridItem className="u-pr4">
            <Button size="large" onClick={acceptCookies}>
              Accept
            </Button>
          </GridItem>
          <GridItem>
            <Button size="large" href="/cookie-policy" appareance="outlined">
              Learn More
            </Button>
          </GridItem>
        </GridContainer>
      </ContentContainer>
    </div>
  );
}

export default CookieConsentBanner;
