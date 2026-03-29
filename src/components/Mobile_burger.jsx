import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function MobileMenu({ isOpen, onClose, currentLang, onLangChange }) {
  const { t } = useTranslation();

  const menuItems = [
    { name: t('nav.flowers'), path: '/category/flowers' },
    { name: t('nav.bouquets'), path: '/category/bouquets' },
    { name: t('nav.gifts'), path: '/category/gifts' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.contactSchedule'), action: 'scrollBottom' }
  ];

  const languages = ['RU', 'RO'];

  const handleScrollBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-[50] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <div className={`fixed top-0 left-0 w-full h-full sm:w-[450px] bg-[#E6DBD1] z-[55] transition-transform duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full px-6 py-8">
          <nav className="flex flex-col space-y-4 flex-grow mt-15">
            {menuItems.map((item, index) => {
              const baseClasses = `font-main text-lg text-[#4A3F35] px-8 py-4 border border-[#4A3F35]/50 rounded-[20px] transition-all duration-500 flex items-center hover:bg-[#4A3F35]/5 active:scale-[0.98] w-full text-left ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`;
              const delayStyle = { transitionDelay: isOpen ? `${index * 60}ms` : '0ms' };

              return item.path ? (
                <Link 
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  style={delayStyle}
                  className={baseClasses}
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={handleScrollBottom}
                  style={delayStyle}
                  className={baseClasses}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>
          
          <div className="flex justify-center gap-x-10 items-center pt-10">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                className={`text-xl font-bad transition-all duration-300 ${
                  currentLang === l ? 'text-[#4A3F35] scale-110' : 'text-[#4A3F35]/30'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
