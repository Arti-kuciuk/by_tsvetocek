import React, { useEffect, useState } from 'react';
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

  return (
    <section className="px-6 md:px-16 md:py-16 py-4">
      
      <div className="hidden md:flex bg-[#E5DACE] md:rounded-[40px] md:border-[#4A3F35]/50 md:border-[1px] p-16 
                      flex-row md:items-stretch gap-x-10 relative overflow-hidden">

        <div className="flex flex-col flex-1 w-full min-w-0">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col items-start text-[#2D2A26]/80 space-y-1 text-lg uppercase">
              <p>{t('dailyBloom.line1')}</p>
              <p>{t('dailyBloom.line2')}</p>
              <p>{t('dailyBloom.line3')}</p>
            </div>
            <div className="flex flex-col items-end text-right text-[#2D2A26]/80 text-lg uppercase pt-2 mr-6">
              <p>{t('dailyBloom.line4')}</p>
              <p>{t('dailyBloom.line5')}</p>
            </div>
          </div>

          <div className="mt-auto w-full text-left">
            <h2 
              className="font-joliet md:text-[11.5vw] lg:text-[10vw] text-[#2D2A26] leading-[0.9] whitespace-nowrap"
              style={{ WebkitTextStroke: '0.5px #4A3F35' }}
            >
              {t('dailyBloom.title')}
            </h2>
            <h2 
              className="font-joliet md:text-[8.5vw] lg:text-[7.5vw] text-[#2D2A26] leading-[0.9] mt-4 whitespace-nowrap"
              style={{ WebkitTextStroke: '0.5px #4A3F35' }}
            >
              {t('dailyBloom.subtitle')}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center justify-end shrink-0">
          <div className="relative inline-block border-[#4A3F35]/50 border-[1px] rounded-[40px] overflow-hidden leading-[0]">
            <img src={imageUrl} alt={t('dailyBloom.imageAlt')} className="w-full max-h-[500px] object-cover" />
          </div>
        </div>
      </div>

      <div className="flex md:hidden flex-col">
          <h2 className="font-joliet text-[16vw] text-[#2D2A26] leading-none my-4 "
              style={{ WebkitTextStroke: '0.5px #4A3F35' }}>
              {t('dailyBloom.title')}
          </h2>

          <div className="bg-[#E5DACE] border-[#4A3F35]/50 border-[1px] rounded-[30px] p-6 mb-2 flex flex-col">
              <div className="w-full aspect-[9/16] border-[#4A3F35]/40 border-[1px] rounded-[20px] overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={t('dailyBloom.imageAltMobile')} 
                    className="w-full h-full object-cover" 
                />
              </div>

              <h2 className="font-joliet text-[9vw] text-[#2D2A26] leading-none mt-6 self-end text-right"
                  style={{ WebkitTextStroke: '0.5px #4A3F35' }}>
              {t('dailyBloom.subtitle')}
              </h2>
          </div>
      </div>

    </section>
  );
}
