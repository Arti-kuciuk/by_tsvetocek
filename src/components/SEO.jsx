import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SITE_NAME, DEFAULT_OG_IMAGE, toAbsoluteUrl, buildPageUrl } from '../config/site';

const OG_LOCALE = { ru: 'ru_RU', ro: 'ro_RO' };

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const defaultDescription = t('seo.defaultDescription');
  const seoTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const seoDescription = description || defaultDescription;
  const seoImage = toAbsoluteUrl(image || DEFAULT_OG_IMAGE);
  const seoUrl = url ? buildPageUrl(url) : buildPageUrl(pathname);
  const ogLocale = OG_LOCALE[i18n.language] || OG_LOCALE.ru;

  return (
    <Helmet htmlAttributes={{ lang: i18n.language }}>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoUrl} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
