function norm(v) {
  if (v == null) return '';
  const s = String(v).trim();
  return s;
}

/** Румынская локаль: ro, ro-MD и т.д. */
export function isRomanian(lang) {
  return String(lang || '').toLowerCase().startsWith('ro');
}

/** Английская локаль: en, en-US и т.д. */
export function isEnglish(lang) {
  return String(lang || '').toLowerCase().startsWith('en');
}

/** @param {string} lang i18n.language */
export function getProductTitle(product, lang) {
  const ru = norm(product?.title_ru);
  const ro = norm(product?.title_ro);
  const en = norm(product?.title_en);
  if (isRomanian(lang)) return ro || ru || en;
  if (isEnglish(lang)) return en || ru || ro;
  return ru || ro || en;
}

export function getProductDescription(product, lang, fallback = '') {
  const ru = norm(product?.description_ru);
  const ro = norm(product?.description_ro);
  const en = norm(product?.description_en);
  let text;
  if (isRomanian(lang)) text = ro || ru || en;
  else if (isEnglish(lang)) text = en || ru || ro;
  else text = ru || ro || en;
  return text || fallback;
}
