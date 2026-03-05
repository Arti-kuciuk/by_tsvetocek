import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Импортируем хук

export default function FloatingCart() {
  // Достаем общее количество из контекста
  const { totalItems } = useCart();
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      setIsAnimate(true); 
      const timer = setTimeout(() => setIsAnimate(false), 200); 
      return () => clearTimeout(timer); 
    }
  }, [totalItems]); 

  // Если в корзине пусто — не показываем плашку
  if (totalItems <= 0) return null; 

  return (
    <Link 
      to="/cart"
      className={`
        fixed bottom-10 -right-8 z-[40] md:hidden cursor-pointer
        transition-all duration-200 ease-out block
        ${isAnimate ? 'scale-110 -translate-x-2' : 'scale-100 translate-x-0'}
      `}
    >
      <div className="relative bg-[#4A3F35] text-[#E6DBD1] pl-2 pr-10 py-2 rounded-l-[100px] shadow-2xl border-y border-l border-[#E6DBD1]/20">
        
        <div className="w-16 h-16 rounded-full border border-[#E6DBD1]/50 flex items-center justify-center relative">
          
          <img 
            src="/basket_white.svg" 
            alt="Basket" 
            className="w-7 h-7 mb-1.5 object-contain"
          />

          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center">
            <span className="font-main text-[14px] leading-none uppercase tracking-tighter opacity-90">
              {totalItems}
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
}