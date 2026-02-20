import { useEffect } from "react";

function ensureMeta(selector, attribute, value) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    if (attribute === "name") tag.setAttribute("name", selector.replace('meta[name="', "").replace('"]', ""));
    if (attribute === "property") tag.setAttribute("property", selector.replace('meta[property="', "").replace('"]', ""));
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

export default function MetaTags({
  title,
  description,
  canonical,
  image,
}) {
  useEffect(() => {
    if (title) {
      document.title = title.includes("Neeklo") ? title : `${title} | Neeklo`;
      ensureMeta('meta[property="og:title"]', "property", title);
      ensureMeta('meta[name="twitter:title"]', "name", title);
    }

    if (description) {
      ensureMeta('meta[name="description"]', "name", description);
      ensureMeta('meta[property="og:description"]', "property", description);
      ensureMeta('meta[name="twitter:description"]', "name", description);
    }

    if (image) {
      ensureMeta('meta[property="og:image"]', "property", image);
      ensureMeta('meta[name="twitter:image"]', "name", image);
    }

    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
      ensureMeta('meta[property="og:url"]', "property", canonical);
    }
  }, [title, description, canonical, image]);

  return null;
}
