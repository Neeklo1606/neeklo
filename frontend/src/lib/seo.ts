/**
 * SEO meta tags utility (no react-helmet).
 * Updates document.title and meta tags in <head>.
 */

export interface PageSEO {
  title?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  } | null;
  media_collections?: {
    cover?: Array<{ url?: string }>;
  };
}

export interface SEODefaults {
  default_title?: string;
  default_description?: string;
}

/**
 * Resolve meta values and update document head.
 * - document.title = page.seo_title || page.title || defaults.default_title
 * - description = page.seo_description || defaults.default_description
 * - og:title = og.title || resolved title
 * - og:description = og.description || resolved description
 * - og:image = og.image || first cover media url
 */
export function setMetaTags(
  page: PageSEO | null | undefined,
  defaults: SEODefaults = {}
): void {
  if (!page) return;

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : '';

  const title = page.seo_title || page.title || defaults.default_title || '';
  const description =
    page.seo_description || defaults.default_description || '';

  const og = page.og ?? {};
  const ogTitle = og.title || title;
  const ogDescription = og.description || description;
  const coverUrl = page.media_collections?.cover?.[0]?.url;
  const ogImage = og.image || coverUrl || '';
  const ogUrl = og.url || currentUrl;

  // document.title
  document.title = title;

  // meta name="description"
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description);
  } else {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', description);
    document.head.appendChild(metaDesc);
  }

  // og:title
  let ogTitleEl = document.querySelector('meta[property="og:title"]');
  if (ogTitleEl) {
    ogTitleEl.setAttribute('content', ogTitle);
  } else {
    ogTitleEl = document.createElement('meta');
    ogTitleEl.setAttribute('property', 'og:title');
    ogTitleEl.setAttribute('content', ogTitle);
    document.head.appendChild(ogTitleEl);
  }

  // og:description
  let ogDescEl = document.querySelector('meta[property="og:description"]');
  if (ogDescEl) {
    ogDescEl.setAttribute('content', ogDescription);
  } else {
    ogDescEl = document.createElement('meta');
    ogDescEl.setAttribute('property', 'og:description');
    ogDescEl.setAttribute('content', ogDescription);
    document.head.appendChild(ogDescEl);
  }

  // og:image (only update when we have a value)
  if (ogImage) {
    let ogImageEl = document.querySelector('meta[property="og:image"]');
    if (ogImageEl) {
      ogImageEl.setAttribute('content', ogImage);
    } else {
      ogImageEl = document.createElement('meta');
      ogImageEl.setAttribute('property', 'og:image');
      ogImageEl.setAttribute('content', ogImage);
      document.head.appendChild(ogImageEl);
    }
  }

  // canonical
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', currentUrl);
  } else {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', currentUrl);
    document.head.appendChild(canonicalLink);
  }

  // og:url (og.url from CMS or current URL)
  let ogUrlEl = document.querySelector('meta[property="og:url"]');
  if (ogUrlEl) {
    ogUrlEl.setAttribute('content', ogUrl);
  } else {
    ogUrlEl = document.createElement('meta');
    ogUrlEl.setAttribute('property', 'og:url');
    ogUrlEl.setAttribute('content', ogUrl);
    document.head.appendChild(ogUrlEl);
  }

  // Twitter card (same values)
  let twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', ogTitle);
  let twitterDesc = document.querySelector(
    'meta[property="twitter:description"]'
  );
  if (twitterDesc) twitterDesc.setAttribute('content', ogDescription);
  let twitterImg = document.querySelector('meta[property="twitter:image"]');
  if (twitterImg && ogImage) twitterImg.setAttribute('content', ogImage);
  let twitterUrl = document.querySelector('meta[property="twitter:url"]');
  if (twitterUrl) {
    twitterUrl.setAttribute('content', ogUrl);
  } else {
    twitterUrl = document.createElement('meta');
    twitterUrl.setAttribute('property', 'twitter:url');
    twitterUrl.setAttribute('content', ogUrl);
    document.head.appendChild(twitterUrl);
  }
}
