import React, { useState, useEffect } from 'react';

export default function SubNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Скрываем, когда прокрутили больше 50px
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hidden md:flex justify-center w-full sticky top-[64px] z-40 pointer-events-none">
      <div 
        className={`
          /* Стили островка */
          bg-[#DAC7B6] px-10 py-3 rounded-b-[24px] 
          flex gap-x-8 text-lg
          border-x border-b border-[#4A3F35]/50 pointer-events-auto
          
          /* Анимация */
          transition-all duration-500 ease-in-out transform
          ${isScrolled ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
        `}
      >
        <span className="cursor-pointer hover:opacity-60 transition-opacity pb-0.5">
          Подарки
        </span>
        <span className="cursor-pointer hover:opacity-60 transition-opacity pb-0.5">
          Мероприятия
        </span>
        <span className="cursor-pointer hover:opacity-60 transition-opacity pb-0.5">
          Связь с нами
        </span>
      </div>
    </div>
  );
}