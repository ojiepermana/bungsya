/** Global site data, available in every template as `site.*`. */
export default {
  name: "Bungkit",
  tagline: "Eleventy + Angular 22 + ElysiaJS, all on Bun.",
  description:
    "A single-package starterkit: an Eleventy static site, an Angular 22 SPA, and an ElysiaJS API — sharing one TailwindCSS v4 theme.",
  year: new Date().getFullYear(),
  nav: [
    { text: "Home", url: "/" },
    { text: "About", url: "/about/" },
    { text: "App", url: "/app/" },
  ],
};
