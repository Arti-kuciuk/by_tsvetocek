import React from 'react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const [lang, setLang] = useState('RU');

  const toggleLang = () => {
    setLang(prev => prev === 'RU' ? 'RO' : prev === 'RO' ? 'EN' : 'RU');
  };
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#DAC7B6] border-[#4A3F35]/50 border-b-1 px-6 py-4 md:px-12">
      <div className="flex justify-between md:grid md:grid-cols-3 items-center">

        {/* бургер меню */}  
        <div className="flex md:hidden justify-start items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col justify-center items-start w-8 h-8 transition-opacity hover:opacity-60"
          >

            <div className={`
              h-[1.5px] bg-[#4A3F35] transition-all duration-300 ease-in-out
              ${isOpen ? 'w-8 rotate-45 translate-y-[1px]' : 'w-8 mb-1.5'}
            `} />
            
            <div className={`
              h-[1.5px] bg-[#4A3F35] transition-all duration-300 ease-in-out
              ${isOpen ? 'w-8 -rotate-45' : 'w-5'}
            `} />
          </button>
        </div>
        
        {/* основное меню */}
        <div className="hidden md:flex gap-x-6 text-xl font-main text-[#4A3F35]">
          <a href="#" className="hover:opacity-60 transition-opacity cursor-pointer">
            Цветы
          </a>
          <a href="#" className="hover:opacity-60 transition-opacity cursor-pointer">
            Букеты
          </a>
        </div>

        {/* логотип */}
        <div className="flex justify-center">
          <span className='text-4xl font-joliet' style={{ WebkitTextStroke: '0.5px #4A3F35' }}>
            By Tsvetocek
          </span>
        </div>

        {/* кнопки справа */}
        <div className="flex justify-end items-center gap-x-6">
          {/* Переключатель языка */}
          <button 
            onClick={toggleLang}
            className="hidden md:flex items-center justify-center mt-1 text-xl hover:opacity-60 transition-opacity h-full"
          >
            {lang}
          </button>

          {/* Поиск */}
          <button className="hover:opacity-60 transition-transform">
            <img src="/search.svg" alt="Поиск" className="h-6 w-6"/>
          </button>

          {/* Корзина */}
          <button className="relative hidden md:block hover:opacity-60 transition-transform">
            <img src="/bascket.svg" alt="Корзина" className="h-6 w-8" />
          </button>
        </div>
        
      </div>
    </nav>
  );
}
