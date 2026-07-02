import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../backend/supabaseClient';

export default function DailyBloom() {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState('/daily_bloom.jpeg');

  useEffect(() => {
    const fetchDailyBloom = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'daily_bloom')
        .single();

      if (!error && data && data.value) {
        setImageUrl(data.value);
      }
    };

    fetchDailyBloom();
  }, []);

  // Мягкое появление для контейнеров (Stagger эффект)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Элегантное "прорастание" текста
  const textVariants = {
    hidden: { opacity: 0, y: 20, letterSpacing: "-0.02em" },
    visible: {
      opacity: 1,
      y: 0,
      letterSpacing: "0em",
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }, // Чистый кубический bezier для плавности
    },
  };

  // Плавное раскрытие изображения
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.03 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <section className="px-6 md:px-16 pt-9 pb-12">
      {/* Desktop Version */}
      <motion.div
        className="hidden md:flex bg-[#E5DACE] md:rounded-[40px] md:border-[#4A3F35]/50 md:border-[1px] p-12 flex-row md:items-stretch gap-x-10 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col flex-1 w-full min-w-0">
          <div className="flex justify-between items-start w-full">
            <motion.div variants={textVariants} className="flex flex-col items-start text-[#2D2A26]/80 space-y-1 text-[calc(0.8vw+0.7vh)] uppercase">
              <p>{t('dailyBloom.line1')}</p>
              <p>{t('dailyBloom.line2')}</p>
              <p>{t('dailyBloom.line3')}</p>
            </motion.div>
            <motion.div variants={textVariants} className="flex flex-col items-end text-right text-[#2D2A26]/80 text-[calc(0.8vw+0.7vh)] uppercase mr-6">
              <p>{t('dailyBloom.line4')}</p>
              <p>{t('dailyBloom.line5')}</p>
            </motion.div>
          </div>

          <div className="mt-auto w-full text-left space-y-4">
            <motion.h2
              variants={textVariants}
              className="font-joliet md:text-[11.5vw] lg:text-[10vw] text-[#2D2A26] leading-[0.9] whitespace-nowrap"
              style={{ WebkitTextStroke: '0.5px #4A3F35' }}
            >
              {t('dailyBloom.title')}
            </motion.h2>

            <motion.h2
              variants={textVariants}
              className="font-joliet md:text-[8.5vw] lg:text-[7.5vw] text-[#2D2A26] leading-[0.9] whitespace-nowrap"
              style={{ WebkitTextStroke: '0.5px #4A3F35' }}
            >
              {t('dailyBloom.subtitle')}
            </motion.h2>
          </div>
        </div>
        
        <div className="flex items-center justify-end shrink-0 overflow-hidden rounded-[40px]">
          <motion.div 
            variants={imageVariants}
            className="relative inline-block border-[#4A3F35]/50 border-[1px] rounded-[40px] overflow-hidden leading-[0]"
          >
            <img src={imageUrl} alt={t('dailyBloom.imageAlt')} className="w-full max-h-[500px] object-cover" />
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Version */}
      <motion.div 
        className="flex md:hidden flex-col mt-[-20px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.h2
          variants={textVariants}
          className="font-joliet text-[16vw] text-[#2D2A26] leading-none mb-4"
          style={{ WebkitTextStroke: '0.5px #4A3F35' }}
        >
          {t('dailyBloom.title')}
        </motion.h2>

        <motion.div 
          variants={imageVariants}
          className="bg-[#E5DACE] border-[#4A3F35]/50 border-[1px] rounded-[30px] pt-8 px-8 pb-4 flex flex-col"
        >
          <div className="w-full aspect-[9/16] border-[#4A3F35]/40 border-[1px] rounded-[20px] overflow-hidden">
            <img 
              src={imageUrl} 
              alt={t('dailyBloom.imageAltMobile')} 
              className="w-full h-full object-cover" 
            />
          </div>

          <motion.h2 
            variants={textVariants}
            className="font-joliet text-[9vw] text-[#2D2A26] leading-none mt-4 self-end text-right"
            style={{ WebkitTextStroke: '0.5px #4A3F35' }}
          >
            {t('dailyBloom.subtitle')}
          </motion.h2>
        </motion.div>
      </motion.div>
    </section>
  );
}