import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function EventsPage() {
  const { t } = useTranslation();

  const artBrunch = t('eventsPage.artBrunch', { returnObjects: true });
  const masterclass = t('eventsPage.masterclass', { returnObjects: true });

  const events = [
    { id: 1, image: '/event2.png', ...artBrunch },
    { id: 2, image: '/event1.png', ...masterclass }
  ];

  return (
    <div className="min-h-screen bg-[#E6DBD1] text-[#4A3F35] pb-20">
      <SEO
        title={t('eventsPage.title')}
        description={t('eventsPage.seoDescription')}
        image="/event2.png"
        url="/events"
      />
      
      <div className="md:px-16 px-6 pt-8 md:pt-10 mb-8 md:mb-12">
        <Link to="/" className="text-[#4A3F35]/70 text-[10px] md:text-sm uppercase tracking-[0.2em] hover:text-[#4A3F35] transition-colors flex items-center gap-2 w-fit border-b border-transparent hover:border-[#4A3F35]/30 pb-1">
          {t('eventsPage.back')}
        </Link>
      </div>

      <div className="md:px-16 px-6 mb-10 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-main uppercase tracking-widest text-[#2D2A26]">
          {t('eventsPage.title')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-[#4A3F35]/70 max-w-2xl">
          {t('eventsPage.intro')}
        </p>
      </div>

      <div className="md:px-16 px-6 space-y-12 lg:space-y-16 flex flex-col items-center">
        {events.map((event) => (
          <div key={event.id} className="w-full max-w-7xl bg-white/30 rounded-[40px] border border-[#4A3F35]/10 overflow-hidden flex flex-col md:flex-row items-stretch group hover:bg-white/40 transition-all duration-500 shadow-sm hover:shadow-md">
            
            <div className="w-full md:w-2/5 aspect-[4/5] md:aspect-auto overflow-hidden relative">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 right-6 md:top-8 md:right-8 bg-[#E6DBD1]/90 backdrop-blur-sm text-[#2D2A26] px-5 py-3 rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold shadow-sm border border-[#4A3F35]/10">
                {event.day} • {event.time}
              </div>
            </div>

            <div className="w-full md:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-main uppercase text-[#2D2A26] mb-6 leading-tight tracking-wide">
                  {event.title}
                </h2>
                <p className="text-[#4A3F35]/80 text-base md:text-lg lg:text-xl leading-relaxed whitespace-pre-line border-t border-[#4A3F35]/10 pt-8 pb-10">
                  {event.description}
                </p>
              </div>
              
              <div className="mt-auto pt-6 border-t border-[#4A3F35]/10">
                <button 
                  onClick={() => alert(t('eventsPage.registerAlert', { title: event.title }))}
                  className="btn-primary w-full md:w-auto !m-0"
                >
                  {t('eventsPage.register')}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
