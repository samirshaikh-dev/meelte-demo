import { APP_NAME, APP_DESCRIPTION, SITE_NAME } from "../config/site";
import { BRAND_COLORS } from "../constants/app-constants";

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: BRAND_COLORS.canvas,
    theme_color: BRAND_COLORS.primary,
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
