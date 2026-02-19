export default function Events() {
    return (
      <section className="px-6 md:px-16 py-8 md:py-16">
        <div className="bg-[#E5DACE] md:rounded-[40px] md:border-[#4A3F35]/50 md:border-[1px] p-6 md:p-16 
                        flex flex-col md:flex-row md:items-stretch gap-y-10 md:gap-x-20 relative overflow-hidden">
          
          {/* ФОТО: Слева на десктопе */}
          <div className="w-full md:w-1/3 aspect-[4/5] md:aspect-square shrink-0">
            <img 
              src="/events.jpg" 
              alt="Мастер-класс по флористике" 
              className="w-full h-full object-cover rounded-[30px] md:rounded-[40px] border-[#4A3F35]/20 border-[1px]"
            />
          </div>
  
          {/* КОНТЕНТ: текст и кнопка */}
          <div className="w-full md:w-1/2 flex flex-col items-start">

            <div className="font-main text-[#2D2A26] text-4xl md:mt-auto">
                <span>Создай красоту с нами</span> 
            </div>

            <div className="md:mt-auto">
              <p className="font-main text-[#2D2A26] text-lg md:text-[1.4vw] leading-relaxed mb-8 md:mb-12 text-left max-w-[500px]">
                В нашей мастерской мы создаем пространство, где каждый может 
                замедлиться и найти вдохновение. Мы верим, что творчество — это лучший 
                способ восстановить внутренний баланс.
              </p>
  
              <button className="btn-primary px-12 py-5">
                Все мероприятия
              </button>
            </div>
          </div>
  
        </div>
      </section>
    );
  }