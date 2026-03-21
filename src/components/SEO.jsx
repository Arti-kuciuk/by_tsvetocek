import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  const siteName = "by tsvetocek";
  const defaultTitle = "Бутик цветов и подарков | by tsvetocek";
  
  const defaultDescription = "Авторские букеты, подарки и мастер-классы по флористике в Кишиневе от студии бай цветочек (by tsvetocek).";
  const defaultImage = "https://by-tsvetocek.vercel.app/event1.png";

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || "https://by-tsvetocek.vercel.app";

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content="by tsvetocek, бай цветочек, цветы Кишинев, доставка цветов, авторские букеты, подарки, флористика" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
    </Helmet>
  );
}