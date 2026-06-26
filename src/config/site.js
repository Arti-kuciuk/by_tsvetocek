export const SITE_NAME = 'by tsvetocek';
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://by-tsvetocek.vercel.app').replace(/\/$/, '');
export const DEFAULT_OG_IMAGE = `${SITE_URL}/event1.png`;

export function toAbsoluteUrl(path) {
  if (!path) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildPageUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getProductImage(product) {
  if (product?.images?.length > 0) return product.images[0];
  return product?.image_url || DEFAULT_OG_IMAGE;
}
