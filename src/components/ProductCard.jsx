import React from 'react';

export default function ProductCard({ image, title, price, onAdd }) {
  return (
    <div className="bg-[#E5DACE] rounded-[30px] border-[#4A3F35]/50 border-[1px] overflow-hidden flex flex-col w-full font-jolit text-[#4A3F35] md:max-w-[350px] h-full">
      
      {/* Контейнер для фото с закруглением */}
      <div>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>

      <hr className="border-[#4A3F35]/50"/>

      {/* Инфо-блок */}
      <div className="px-6 pb-6 pt-4 flex flex-col items-center flex-1">
        <h3 className="text-[#4A3F35] text-xl mb-3 md:mb-6 text-center">
          {title}
        </h3>

        {/* Кнопка с ценой  */}
        <button
          onClick={() => onAdd({ title, price, image })}
          className="mt-auto w-full btn-primary px-6 py-2 flex justify-center items-center"
        >
          {price} MDL
        </button>
      </div>

    </div>
  );
}