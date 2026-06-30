/**
 * Eleventy 3 configuration (ESM — the root package.json sets "type": "module").
 *
 * Source lives in apps/website/ and is built to dist/website/.
 * The stylesheet is produced separately by the Tailwind CLI into
 * dist/website/assets/styles.css (see the "build:css" / "dev:website:css" scripts),
 * so during `--serve` we tell the dev server to also watch that file and live-reload
 * the browser whenever Tailwind rewrites it.
 */
export default function (eleventyConfig) {
  // Copy anything in apps/website/public/ straight to the site root (favicon, robots.txt, …).
  eleventyConfig.addPassthroughCopy({ "apps/website/public/": "/" });

  // Reload the browser when the externally-built Tailwind stylesheet changes.
  eleventyConfig.setServerOptions({
    watch: ["dist/website/assets/styles.css"],
  });

  return {
    dir: {
      input: "apps/website",
      output: "dist/website",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
