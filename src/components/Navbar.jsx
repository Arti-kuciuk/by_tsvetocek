import React from 'react';
import { useState, useEffect } from 'react';
import MobileMenu from './Mobile_burger';

// 1. Добавляем itemCount в пропсы
export default function Navbar({ itemCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false); 
  const [lang, setLang] = useState('RU');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const [isPop, setIsPop] = useState(false);

  // Анимация на 300мс
  useEffect(() => {
    if (itemCount > 0) {
      setIsPop(true);
      const timer = setTimeout(() => setIsPop(false), 300); 
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  const toggleLang = () => {
    setLang(prev => prev === 'RU' ? 'RO' : prev === 'RO' ? 'EN' : 'RU');
  };
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#DAC7B6] border-[#4A3F35]/50 border-b px-6 py-4 md:px-12">
      <div className="flex justify-between md:grid md:grid-cols-3 items-center">

        {/* ... Бургер и Меню (без изменений) ... */}  
        <div className="flex md:hidden justify-start items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col justify-center items-start w-8 h-8 transition-opacity hover:opacity-60 z-[60]"
          >
            <div className={`h-[1.5px] bg-[#4A3F35] transition-all duration-300 ${isOpen ? 'w-8 rotate-45 translate-y-[1.5px]' : 'w-8 mb-1.5'}`} />
            <div className={`h-[1.5px] bg-[#4A3F35] transition-all duration-300 ${isOpen ? 'w-8 -rotate-45 -translate-y-[0px]' : 'w-5'}`} />
          </button>
        </div>
        
        <div className="hidden md:flex gap-x-6 text-xl font-sn text-[#4A3F35]">
          <a href="#" className="hover:opacity-60 transition-opacity tracking-wider">Цветы</a>
          <a href="#" className="hover:opacity-60 transition-opacity tracking-wider">Букеты</a>
        </div>

        <div className="flex justify-center">
          <span className='text-4xl font-joliet' style={{ WebkitTextStroke: '0.5px #4A3F35' }}>
            By Tsvetocek
          </span>
        </div>

        {/* Кнопки справа */}
        <div className="flex justify-end items-center gap-x-4 md:gap-x-6">
          <button onClick={toggleLang} className="hidden md:flex text-xl hover:opacity-60 transition-opacity uppercase">
            {lang}
          </button>

          <button className="hover:opacity-60">
            <img src="/search.svg" alt="Поиск" className="h-6 w-6"/>
          </button>

          {/* 2. Обновленная кнопка корзины */}
          <button className="relative hidden md:block hover:opacity-60 transition-transform">
            <img src="/basket.svg" alt="Корзина" className="h-6 w-8" />
            
            {/* 3. Условие для показа цифры */}
            {itemCount > 0 && (
              <span className={`
                absolute -top-2 -right-2
                bg-[#4A3F35] text-[#E6DBD1] 
                text-[10px] font-bold leading-none
                flex items-center justify-center 
                rounded-full border border-[#DAC7B6]
                /* Динамика: минимальная ширина для 1 цифры, и расширение для 2+ */
                min-w-[16px] h-4 px-1
                transition-all duration-300 ease-out
                ${isPop ? 'scale-125 shadow-lg shadow-[#4A3F35]/40' : 'scale-100'}
              `}>
                <span className="translate-x-[0.5px]">
                  {itemCount}
                </span>
              </span>
            )}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} 
                  onClose={() => setIsOpen(false)} 
                  currentLang={lang} 
                  onLangChange={(newLang) => setLang(newLang)}/>
    </nav>
  );
}