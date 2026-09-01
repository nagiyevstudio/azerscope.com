// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import copyLocationCovers from "./src/integrations/copy-covers.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://azerscope.com",
  base: "/locations",
  output: "static",
  integrations: [react(), sitemap(), copyLocationCovers()],
  redirects: {
    // Язык по умолчанию для /locations/ — английский (константа DEFAULT_LANG).
    "/": { status: 301, destination: "/locations/en/" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
