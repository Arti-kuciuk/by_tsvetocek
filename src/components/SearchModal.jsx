import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../backend/supabaseClient';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Очищаем поиск при закрытии
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Живой поиск с задержкой (чтобы не спамить базу на каждую букву)
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, title_ru, price, image_url')
        .ilike('title_ru', `%${query}%`) // Ищет совпадения в названии
        .limit(5); // Показываем топ-5 результатов

      if (!error && data) {
        setResults(data);
      }
      setIsLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      searchProducts();
    }, 300); // Ждем 300мс после последнего нажатия

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center pt-20 px-4 sm:px-6">
      {/* Темный фон */}
      <div 
        className="absolute inset-0 bg-[#2D2A26]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Окно поиска */}
      <div className="relative w-full max-w-2xl bg-[#E6DBD1] rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        
        {/* Инпут */}
        <div className="p-4 sm:p-6 border-b border-[#4A3F35]/10 flex items-center gap-4">
          <img src="/search.svg" alt="Поиск" className="w-6 h-6 opacity-50" />
          <input
            type="text"
            placeholder="Поиск букетов и цветов..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xl sm:text-2xl font-main text-[#4A3F35] placeholder:text-[#4A3F35]/40 outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-[#4A3F35]/50 hover:text-[#4A3F35] text-3xl pb-1">
            ×
          </button>
        </div>

        {/* Результаты */}
        <div className="overflow-y-auto overscroll-contain">
          {isLoading && (
            <div className="p-8 text-center text-[#4A3F35]/60">Ищем...</div>
          )}
          
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center text-[#4A3F35]/60">По вашему запросу ничего не найдено.</div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="flex flex-col">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 hover:bg-white/30 transition-colors border-b border-[#4A3F35]/5 last:border-0"
                >
                  <img 
                    src={product.image_url} 
                    alt={product.title_ru} 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-main text-[#4A3F35] uppercase">{product.title_ru}</h3>
                    <p className="text-sm sm:text-base font-bold text-[#4A3F35]/80">{product.price} MDL</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
