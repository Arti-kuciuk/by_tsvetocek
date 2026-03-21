import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ id, image, title, price, stock, onAdd }) {
  const isOutOfStock = stock <= 0;

  return (
    <div className={`bg-[#E5DACE] rounded-[30px] border-[#4A3F35]/50 border-[1px] overflow-hidden flex flex-col w-full font-jolit text-[#4A3F35] md:max-w-[350px] h-full transition-opacity duration-300 ${isOutOfStock ? 'opacity-70' : ''}`}>
      
      <Link to={`/product/${id}`} className="w-full aspect-square overflow-hidden rounded-t-xl bg-gray-50 relative block">
        <img 
          src={image} 
          alt={title} 
          className={`w-full h-full object-cover transition-all duration-500 ${isOutOfStock ? 'grayscale-[40%]' : 'hover:scale-105'}`}
        />
      </Link>

      <hr className="border-[#4A3F35]/50"/>

      <div className="px-6 pb-6 pt-4 flex flex-col items-center flex-1">
        <Link to={`/product/${id}`} className="hover:opacity-70 transition-opacity">
          <h3 className="text-[#4A3F35] text-xl mb-3 md:mb-6 text-center">
            {title}
          </h3>
        </Link>

        <button
          onClick={onAdd}
          disabled={isOutOfStock}
          className={`mt-auto w-full px-6 py-2 flex justify-center items-center rounded-full transition-colors duration-300 ${
            isOutOfStock 
              ? 'bg-gray-400/50 text-[#4A3F35] cursor-not-allowed border-transparent' 
              : 'btn-primary' 
          }`}
        >
          {isOutOfStock ? 'Нет на складе' : `${price} MDL`}
        </button>
      </div>
    </div>
  );
}