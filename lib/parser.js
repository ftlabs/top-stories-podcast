const fetch = require("node-fetch");
const stripHtml = require("string-strip-html");
const Readability = require("readability");
const { JSDOM } = require("jsdom");

module.exports = async url => {
  const fetchResponse = await fetch(url);
  const pageHTML = await fetchResponse.text();
  const doc = new JSDOM(pageHTML, { url });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();

  const { title, byline, excerpt, length, dir, content } = article;

  finalArticle = "<speak>";

  if (title) {
    finalArticle = finalArticle + title + "<break  time='1s'/> ";
  }
  if (byline) {
    finalArticle = finalArticle + byline + "<break time='1s' /> ";
  }

  const strippedContent = stripHtml(article.content)
    .replace(/(\r\n|\n|\r)/gm, "<break />")
    .trim();

  finalArticle = finalArticle + strippedContent;
  finalArticle = finalArticle + "</speak>";
  return {
    ssl: finalArticle,
    content: strippedContent,
    title,
    byline,
    excerpt,
    length,
    dir,
    source: domain_from_url(url)
  };
};

function domain_from_url(url) {
  var result;
  var match;
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
  ) {
    result = match[1];
    if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
      result = match[1];
    }
  }
  return result;
}
