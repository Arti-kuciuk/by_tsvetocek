export default function Events() {
  return (
    <section className="px-0 md:px-16 py-0 md:py-12"> 
      <div className="bg-[#E5DACE] md:rounded-[40px] md:border-[#4A3F35]/50 md:border-[1px] p-6 md:p-16 
                      flex flex-col md:flex-row md:items-stretch gap-y-8 md:gap-x-20 relative overflow-hidden">
        
        {/* ФОТО: Слева на десктопе */}
        <div className="w-full md:w-1/3 aspect-[4/5] md:aspect-square shrink-0">
          <img 
            src="/events.jpg" 
            alt="Мастер-класс по флористике" 
            className="w-full h-full object-cover rounded-[30px] md:rounded-[40px] border-[#4A3F35]/20 border-[1px]"
          />
        </div>

        {/* КОНТЕНТ: обновленная типографика */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <div className="font-main font-normal text-[#4A3F35] text-4xl md:text-5xl mb-6 md:mt-auto leading-[1.1] tracking-tight">
              <span>Создай красоту с нами</span> 
          </div>

          <div className="md:mt-auto md:mr-[200px]">
            <p className="font-main text-[#4A3F35]/80 text-lg md:text-[1.3vw] leading-relaxed mb-8 md:mb-10 text-left max-w-[520px]">
              В нашей мастерской мы создаем пространство, где каждый может 
              замедлиться и найти вдохновение. Мы верим, что творчество — это лучший 
              способ восстановить внутренний баланс.
            </p>

            <button className="btn-primary font-main text-xs uppercase tracking-[0.2em]">
              Все мероприятия
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}