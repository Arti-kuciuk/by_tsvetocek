import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Events() {
  const { t } = useTranslation();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);

    update();
    mq.addEventListener('change', update);

    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <motion.section
      className="px-0 md:px-16 py-0 md:py-12"
      initial={{ opacity: 0, x: isMobile ? -40 : -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.65,
        ease: 'easeOut'
      }}
    > 
      <div className="bg-[#E5DACE] md:rounded-[40px] md:border-[#4A3F35]/50 md:border-[1px] p-6 md:p-14
                      flex flex-col md:flex-row md:items-stretch gap-y-8 md:gap-x-20 relative overflow-hidden">
        
        <div className="w-full md:w-1/3 aspect-[4/5] md:aspect-square shrink-0">
          <img 
            src="/events.jpg" 
            alt={t('eventsBlock.imageAlt')} 
            className="w-full h-full object-cover rounded-[30px] md:rounded-[25px] border-[#4A3F35]/20 border-[1px]"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-start">
          <div className="font-main font-normal text-[#4A3F35] text-4xl md:text-5xl mb-6 md:mt-auto leading-[1.1] tracking-tight">
              <span>{t('eventsBlock.heading')}</span> 
          </div>

          <div className="md:mt-auto md:mr-[200px]">
            <p className="font-main text-[#4A3F35]/80 text-lg md:text-[1.3vw] leading-relaxed mb-8 md:mb-10 text-left max-w-[520px]">
              {t('eventsBlock.text')}
            </p>

            <Link to="/events" className="btn-primary font-main text-xs uppercase tracking-[0.2em] inline-flex">
              {t('eventsBlock.cta')}
            </Link>
          </div>
        </div>
    
      </div>
    </motion.section>
  );
}
