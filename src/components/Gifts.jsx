import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Gifts() {
  const { t } = useTranslation();

  return (
    <section className="px-0 md:px-16 py-0 md:py-12"> 
      <div className="bg-[#E5DACE] md:rounded-[40px] md:border-[#4A3F35]/50 md:border-[1px] p-6 md:p-12 
                      flex flex-col md:flex-row-reverse md:items-stretch md:gap-x-10 relative overflow-hidden">
        
        <div className="w-full md:w-1/3 aspect-[4/5] md:aspect-auto shrink-0 relative rounded-[30px] md:rounded-[25px] overflow-hidden">
          <img 
            src="/gift1.png"
            alt={t('giftsBlock.imageAlt')} 
            className="w-full h-full object-cover border-[#4A3F35]/20 border-[1px]"
          />
        </div>

        <div className="w-full flex flex-col items-start pt-6 md:pt-0">
          <div className="font-main font-normal text-[#4A3F35] text-4xl md:text-5xl mb-6 md:mt-auto leading-[1.1] tracking-tight">
              <span>{t('giftsBlock.heading')}</span> 
          </div>

          <div className="md:mt-auto">
            <p className="font-main text-[#4A3F35]/80 text-lg md:text-[1.3vw] leading-relaxed mb-8 md:mb-10 text-left max-w-[520px]">
              {t('giftsBlock.text')}
            </p>

            <Link to="/category/gifts" className="btn-primary font-main text-xs uppercase tracking-[0.2em] inline-flex">
              {t('giftsBlock.cta')}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
