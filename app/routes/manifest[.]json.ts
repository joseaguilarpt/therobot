import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

interface WebAppManifest {
  short_name: string;
  name: string;
  start_url: string;
  scope: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: ManifestIcon[];
  description: string;
  categories: string[];
  lang: string;
}

const LANGUAGES = [
    "en",
    "es",
    "pt",
    "fr",
    "nl",
    "de",
    "it",
    "id",
    "ru",
  ]; // Add all languages you support

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const lang = url.pathname.split("/")[1];
    const isValidLang = LANGUAGES.includes(lang);
    const baseManifest: WebAppManifest = {
      short_name: "EasyConvert",
      name: "EasyImageConvert",
      description: "Easily convert images between multiple formats online",
      start_url: isValidLang ? `/${lang}/` : "/",
      scope: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#4a90e2",
      lang: isValidLang ? lang : "en",
      categories: ["photo", "utility"],
      icons: [
        {
          purpose: "maskable",
          sizes: "512x512",
          src: "/icon_maskable.png",
          type: "image/png",
        },
        {
          purpose: "any",
          sizes: "512x512",
          src: "/icon_rounded.png",
          type: "image/png",
        },
      ],
    };

    return json(baseManifest, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/manifest+json",
      },
    });
  } catch (error) {
    console.error("Error generating manifest:", error);
    return json({ error: "Failed to generate manifest" }, { status: 500 });
  }
};
