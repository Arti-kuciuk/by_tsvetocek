import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#DAC7B6] text-[#4A3F35] py-12 px-6 md:px-16 mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Сетка: 2 колонки на мобильном, 4 на десктопе */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
          
          {/* Блок 1: Связь с нами */}
          <div className="space-y-4">
            <h3 className="text-2xl font-main tracking-wide">Связь с нами</h3>
            <div className="flex flex-col space-y-1 text-xs md:text-base opacity-80">
              <a href="tel:+37360685937" className="hover:opacity-100 transition-opacity">+373 60 68 59 37</a>
              <a href="mailto:racova.daria@gmail.com" className="hover:opacity-100 transition-opacity">racova.daria@gmail.com</a>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Matei+Basarab+1/3+Chisinau" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-100 transition-opacity"
              >
                Matei Basarab 1/3
              </a>
            </div>
          </div>

          {/* Блок 2: График работы */}
          <div className="space-y-4">
            <h3 className="text-2xl font-main tracking-wide">График работы</h3>
            <div className="text-xs md:text-base opacity-80 space-y-1">
              <p>Пн — Пт: 9:00 — 19:00</p>
              <p>Сб: 10:00 — 17:00</p>
              <p>Вс: выходной</p>
            </div>
          </div>

          {/* Блок 3: Способы оплаты */}
          <div className="space-y-4">
            <h3 className="text-2xl font-main tracking-wide">Способы оплаты</h3>
            <div className="text-xs md:text-base opacity-80 space-y-1">
              <p>Наличными курьеру</p>
              <p>Картой на сайте (скоро)</p>
              <p>P2P перевод</p>
            </div>
          </div>

          {/* Блок 4: Соцсети */}
          <div className="space-y-4">
            <h3 className="text-2xl font-main tracking-wide">Соцсети</h3>
            <div className="flex flex-col space-y-1 text-xs md:text-base opacity-80">
              <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Facebook</a>
              <a href="#" className="hover:underline transition-opacity">WhatsApp</a>
            </div>
          </div>

        </div>

        {/* Нижняя подпись */}
        <div className="mt-16 pt-8 border-t border-[#4A3F35]/10 text-center">
          <p className="font-main text-[#4A3F35]/60 text-sm md:text-base">
            С любовью к каждому лепестку ♥
          </p>
        </div>
      </div>
    </footer>
  );
}
