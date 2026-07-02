import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../backend/supabaseClient';
import { getProductTitle } from '../utils/productLocale';

/** null = неизвестно; после первого запроса кэшируем наличие колонки */
let titleEnColumnAvailable = null;

function isMissingTitleEnError(error) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('title_en') && message.includes('does not exist');
}

async function fetchSearchResults(term, limit = 5) {
  const pattern = `%${term}%`;

  if (titleEnColumnAvailable !== false) {
    const withEn = await supabase
      .from('products')
      .select('id, title_ru, title_ro, title_en, price, image_url')
      .or(`title_ru.ilike.${pattern},title_ro.ilike.${pattern},title_en.ilike.${pattern}`)
      .limit(limit);

    if (!withEn.error) {
      titleEnColumnAvailable = true;
      return { data: withEn.data ?? [], error: null };
    }

    if (!isMissingTitleEnError(withEn.error)) {
      return { data: [], error: withEn.error };
    }

    titleEnColumnAvailable = false;
  }

  const withoutEn = await supabase
    .from('products')
    .select('id, title_ru, title_ro, price, image_url')
    .or(`title_ru.ilike.${pattern},title_ro.ilike.${pattern}`)
    .limit(limit);

  return { data: withoutEn.data ?? [], error: withoutEn.error };
}

export default function SearchModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await fetchSearchResults(query.trim());

      if (error) {
        console.error('Search error:', error);
        setResults([]);
      } else {
        setResults(data);
      }
      setIsLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, i18n.language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center pt-20 px-4 sm:px-6">
      <div 
        className="absolute inset-0 bg-[#2D2A26]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-[#E6DBD1] rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        
        <div className="p-4 sm:p-6 border-b border-[#4A3F35]/10 flex items-center gap-4">
          <img src="/search.svg" alt={t('common.searchAlt')} className="w-6 h-6 opacity-50 shrink-0" />
          
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-xl sm:text-2xl font-main text-[#4A3F35] placeholder:text-[#4A3F35]/40 outline-none" 
            autoFocus
          />
          
          <button onClick={onClose} className="text-[#4A3F35]/50 hover:text-[#4A3F35] text-3xl pb-1 shrink-0">
            ×
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain">
          {isLoading && (
            <div className="p-8 text-center text-[#4A3F35]/60">{t('search.loading')}</div>
          )}
          
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center text-[#4A3F35]/60">{t('search.empty')}</div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="flex flex-col">
              {results.map((product) => {
                const title = getProductTitle(product, i18n.language);
                return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 hover:bg-white/30 transition-colors border-b border-[#4A3F35]/5 last:border-0"
                >
                  <img 
                    src={product.image_url} 
                    alt={title} 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-main text-[#4A3F35] uppercase">{title}</h3>
                    <p className="text-sm sm:text-base font-bold text-[#4A3F35]/80">{product.price} MDL</p>
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
