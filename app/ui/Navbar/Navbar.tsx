// app/components/Navbar.tsx

import { useEffect, useState, useRef } from "react";
import "./Navbar.scss";
import { Link, useLocation } from "@remix-run/react";
import ContentContainer from "../ContentContainer/ContentContainer";
import GridContainer from "../Grid/Grid";
import GridItem from "../Grid/GridItem";
import Heading from "../Heading/Heading";
import classNames from "classnames";
import Icon from "../Icon/Icon";
import Button from "../Button/Button";
import Sidebar from "../Sidebar/Sidebar";
import { IconType } from "react-icons";
import svg from "../../img/thebot.svg";
import svgDarkMode from "../../img/thebot-white.svg";
import { useTheme } from "~/context/ThemeContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSelector/LanguageSelector";

const Navbar = ({
  autoScrolled,
  items,
}: {
  autoScrolled?: boolean;
  items?: { value: string; href?: string; icon: IconType }[];
}) => {
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const menuRef = useRef<HTMLUListElement>(null);

  const defaultOptions = [
    {
      value: "nav.home",
      href: `/${i18n?.language ?? ''}`,
      icon: "FaHome",
    },
    {
      value: "nav.topTools",
      href: `/${i18n?.language ?? ''}#top-tools`,
      icon: "FaSearch",
    },
    {
      value: "nav.contact",
      href: `/${i18n?.language ?? ''}/contact`,
      icon: "FaPhone",
    },
    {
      value: "nav.about",
      href: `/${i18n?.language ?? ''}/about`,
      icon: "FaHome",
    },
  ];
  

  const options =
    items ?? defaultOptions.map((item) => ({ ...item, value: t(item.value) }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]');
      if (!menuItems) return;

      const currentIndex = Array.from(menuItems).findIndex(
        (item) => item === document.activeElement
      );

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          if (currentIndex < menuItems.length - 1) {
            (menuItems[currentIndex + 1] as HTMLElement).focus();
          } else {
            (menuItems[0] as HTMLElement).focus();
          }
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          if (currentIndex > 0) {
            (menuItems[currentIndex - 1] as HTMLElement).focus();
          } else {
            (menuItems[menuItems.length - 1] as HTMLElement).focus();
          }
          break;
      }
    };

    menuRef.current?.addEventListener("keydown", handleKeyDown);

    return () => {
      menuRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const keepScrolled = autoScrolled ? true : isScrolled;

  const navigateHome = () => {
    window.location.href = `/${i18n.language ?? 'en'}`;
  };
  return (
    <nav
      className={`navbar ${keepScrolled ? "scrolled" : ""}`}
      role="navigation"
      aria-label={t("nav.main")}
    >
      <ContentContainer>
        <GridContainer alignItems="center" justifyContent="space-between">
          <GridItem>
            <Button
              appareance="link"
              onClick={navigateHome}
              aria-label={t("homePageLink")}
            >
              <GridContainer alignItems="flex-start">
                <img
                  src={theme === "dark-mode" ? svgDarkMode : svg}
                  className="image-bot"
                  alt={t("logoAlt")}
                />
                <Heading level={1} appearance={6} color={"white"}>
                  {t("pageName")}
                </Heading>
              </GridContainer>
            </Button>
          </GridItem>
          <GridContainer justifyContent="flex-end">
            <ul className="navbar__menu" ref={menuRef} role="menubar">
              {options.map((item, index) => (
                <li
                  key={item.value}
                  className={classNames(
                    "navbar__menu-item",
                    location.pathname === item.href && "--active",
                    keepScrolled && "--contrast"
                  )}
                  role="none"
                >
                  <a
                    href={item.href ?? ""}
                    role="menuitem"
                    tabIndex={index === 0 ? 0 : -1}
                    aria-current={
                      location.pathname === item.href ? "page" : undefined
                    }
                  >
                    {t(item.value)}
                  </a>
                </li>
              ))}
              <li role="menuitem">
                <LanguageSwitcher keepScrolled={keepScrolled} />
              </li>
            </ul>
            <div className="navbar__menu--mobile u-pl2">
              <Button
                appareance="subtle"
                onClick={() => setIsOpen(true)}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={t("openMobileMenu")}
              >
                <Icon
                  icon="FaBars"
                  size="medium"
                  color={keepScrolled ? "primary" : "white"}
                  aria-hidden="true"
                />
              </Button>
            </div>
          </GridContainer>
        </GridContainer>
        <Sidebar
          className="navigation-sidebar__mobile"
          items={options}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          id="mobile-menu"
          label={t("mobileMenuLabel")}
        >
          <LanguageSwitcher keepScrolled={keepScrolled} />
        </Sidebar>
      </ContentContainer>
    </nav>
  );
};

export default Navbar;
