import { SITE_NAME, SITE_URL, toAbsoluteUrl } from '../config/site';
import { isInStock } from './productStock';

export function buildLocalBusinessSchema(t) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/event1.png`,
    telephone: '+37360685937',
    email: 'racova.daria@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Strada Miron Costin 18',
      addressLocality: 'Chișinău',
      addressCountry: 'MD',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '17:00',
      },
    ],
    sameAs: ['https://www.instagram.com/by.tsvetocek/'],
    description: t('seo.defaultDescription'),
  };
}

export function buildProductSchema(product, title, description) {
  const inStock = isInStock(product);
  const image = toAbsoluteUrl(
    product.images?.length > 0 ? product.images[0] : product.image_url
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    image: [image],
    sku: String(product.id),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: 'MDL',
      price: product.price,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };
}
