export default function DailyBloom() {
    return (
      <section className="px-6 md:px-16 md:py-16 py-4">
        
        {/* ДЕСТОПНАЯ ВЕРСИЯ (hidden на мобилках) */}
        <div className="hidden md:flex bg-[#E5DACE] md:rounded-[40px] md:border-[#4A3F35]/50 md:border-[1px] p-16 
                        flex-row md:items-stretch gap-x-10 relative overflow-hidden">

          <div className="@container flex flex-col flex-1">
              <div className="flex justify-between items-start w-full">
                {/* текст */}
                <div className="flex flex-col items-start text-[#2D2A26]/80 space-y-1 text-lg uppercase ">
                  <p>Эстетика в каждом цветке</p>
                  <p>Свежесть внутри</p>
                  <p>Привычка</p>
                </div>
                <div className="flex flex-col items-end text-right text-[#2D2A26]/80 text-lg uppercase pt-2 mr-6">
                  <p>С любовью к каждому</p> 
                  <p>лепестку</p> 
                </div>
              </div>
              <div className="mt-auto w-full text-left">
                <h2 className="font-joliet md:text-[19.3cqw] text-[#2D2A26] leading-[0.9] whitespace-nowrap"
                    style={{ WebkitTextStroke: '0.5px #4A3F35' }}>
                  Daily Bloom:
                </h2>
                <h2 className="font-joliet md:text-[14.75cqw] text-[#2D2A26] leading-[0.9] mt-4 whitespace-nowrap"
                    style={{ WebkitTextStroke: '0.5px #4A3F35' }}>
                  Aesthetics as a habit
                </h2>
              </div>
          </div>
          {/* картинка */}
          <div className="flex items-center justify-end shrink-0">
            <div className="relative inline-block border-[#4A3F35]/50 border-[1px] rounded-[40px] overflow-hidden leading-[0]">
              <img src="/daily_bloom.jpeg" alt="Daily Bloom" className="w-full max-h-[500px]" />
            </div>
          </div>
        </div>
  
        {/* МОБИЛЬНАЯ ВЕРСИЯ */}
        <div className="flex md:hidden flex-col">
        
            <h2 className="font-joliet text-[16vw] text-[#2D2A26] leading-none my-4 "
                style={{ WebkitTextStroke: '0.5px #4A3F35' }}>
                Daily Bloom:
            </h2>

            {/* Контейнер с рамкой (внутри только фото и подзаголовок) */}
            <div className="bg-[#E5DACE] border-[#4A3F35]/50 border-[1px] rounded-[30px] p-6 mb-2 flex flex-col">
                
                {/* Картинка */}
                <div className="w-full aspect-[3/4] border-[#4A3F35]/40 border-[1px] rounded-[20px] overflow-hidden">
                <img 
                    src="/daily_bloom.jpeg" 
                    alt="Daily Bloom Mobile" 
                    className="w-full h-full object-cover" 
                />
                </div>

                {/* Подзаголовок остается внутри снизу */}
                <h2 className="font-joliet text-[9vw] text-[#2D2A26] leading-none mt-6 self-end text-right"
                    style={{ WebkitTextStroke: '0.5px #4A3F35' }}>
                Aesthetics as a habit
                </h2>

            </div>
        </div>
  
      </section>
    );
  }