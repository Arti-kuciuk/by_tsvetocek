function norm(v) {
  if (v == null) return '';
  const s = String(v).trim();
  return s;
}

/** Румынская локаль: ro, ro-MD и т.д. */
export function isRomanian(lang) {
  return String(lang || '').toLowerCase().startsWith('ro');
}

/** @param {string} lang i18n.language */
export function getProductTitle(product, lang) {
  const ru = norm(product?.title_ru);
  const ro = norm(product?.title_ro);
  if (isRomanian(lang)) return ro || ru;
  return ru || ro;
}

export function getProductDescription(product, lang, fallback = '') {
  const ru = norm(product?.description_ru);
  const ro = norm(product?.description_ro);
  const text = isRomanian(lang) ? ro || ru : ru || ro;
  return text || fallback;
}
