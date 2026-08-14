module.exports = function(eleventyConfig) {
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  eleventyConfig.addFilter("date", (dateObj) => {
    const d = new Date(dateObj);
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  });

  // Turns plain text with blank-line-separated paragraphs into <p> tags,
  // for simple text blocks in the CMS page builder.
  eleventyConfig.addFilter("nl2p", (text) => {
    if (!text) return "";
    return text.split(/\n\s*\n/).map(p => `<p>${p.trim()}</p>`).join("\n");
  });

  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("documents.json");
  eleventyConfig.addPassthroughCopy("videos.json");
  eleventyConfig.addPassthroughCopy({ ".assetsignore": ".assetsignore" });

  eleventyConfig.addCollection("newsPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/news/*.md").sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
