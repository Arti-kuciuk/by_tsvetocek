import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#DAC7B6] text-[#4A3F35] py-12 px-6 md:px-16 mt-20">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-main tracking-wide">{t('footer.contact')}</h3>
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

          <div className="space-y-4">
            <h3 className="text-2xl font-main tracking-wide">{t('footer.hours')}</h3>
            <div className="text-xs md:text-base opacity-80 space-y-1">
              <p>{t('footer.weekdays')}</p>
              <p>{t('footer.saturday')}</p>
              <p>{t('footer.sunday')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-main tracking-wide">{t('footer.payment')}</h3>
            <div className="text-xs md:text-base opacity-80 space-y-1">
              <p>{t('footer.cash')}</p>
              <p>{t('footer.cardSoon')}</p>
              <p>{t('footer.p2p')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-main tracking-wide">{t('footer.social')}</h3>
            <div className="flex flex-col space-y-1 text-xs md:text-base opacity-80">
              <a href="https://www.instagram.com/by.tsvetocek/" className="hover:opacity-100 transition-opacity">Instagram</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Facebook</a>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-[#4A3F35]/10 text-center">
          <p className="font-main text-[#4A3F35]/60 text-sm md:text-base">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
