import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext'; 
import { supabase } from '../backend/supabaseClient';
import { getProductTitle } from '../utils/productLocale';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const { cartItems, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!cartItems) return null;

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert(t('cart.fillRequired'));
      return;
    }

    setIsSubmitting(true); 

    try {
      const { error: orderError } = await supabase
        .from('orders')
        .insert([
          { 
            customer_name: formData.name,
            customer_phone: formData.phone,
            address: formData.address,
            comment: formData.comment,
            total_price: totalPrice,
            items: cartItems,
            status: 'new'
          }
        ]);

      if (orderError) throw orderError;

      for (const item of cartItems) {
        const newStock = Math.max(0, item.stock - item.quantity); 
        
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock_count: newStock })
          .eq('id', item.id);

        if (stockError) console.error('Ошибка обновления склада:', stockError);
      }

      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

      const itemsBlock = cartItems.map(item => {
        const lineTitle = getProductTitle(item, i18n.language);
        return `• ${lineTitle} x${item.quantity} — ${item.price * item.quantity} MDL`;
      }).join('\n');

      const message = t('cart.telegramBody', {
        name: formData.name.toUpperCase(),
        phone: formData.phone,
        address: formData.address.toUpperCase(),
        comment: formData.comment || t('cart.telegramNoComment'),
        items: itemsBlock,
        total: totalPrice
      });

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
      });

      alert(t('cart.orderSuccess'));
      clearCart();
      window.location.href = "/";

    } catch (err) {
      console.error("Критическая ошибка:", err);
      alert(t('cart.orderError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E6DBD1] p-6 md:px-16 md:py-12">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-12">
            <Link to="/" className="text-[#4A3F35] text-sm tracking-[0.2em]">
              {t('cart.backToShopping')}
            </Link>
            
            {cartItems.length > 0 && (
              <button 
                onClick={() => {
                  if(window.confirm(t('cart.confirmClear'))) clearCart();
                }}
                className="text-[#4A3F35]/40 text-[10px] uppercase tracking-[0.2em] hover:text-red-800 transition-colors border-b border-transparent hover:border-red-800/20 pb-0.5"
              >
                {t('cart.clearAll')}
              </button>
            )}
          </div>

          <div className="space-y-8 mt-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-2xl text-[#4A3F35]/40 font-main uppercase">{t('cart.empty')}</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-row gap-4 md:gap-6 items-center border-b border-[#4A3F35]/10 pb-8">
                  <img src={item.image} className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-[20px]" alt={getProductTitle(item, i18n.language)} />
                  <div className="flex flex-1 flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="flex-1">
                      <h3 className="text-sm md:text-xl font-main text-[#4A3F35] uppercase leading-tight">{getProductTitle(item, i18n.language)}</h3>
                      <p className="text-[#4A3F35]/60 text-xs md:text-base">{item.price} MDL</p>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-10 mt-2 md:mt-0">
                      <div className="flex items-center gap-3 md:gap-6 border border-[#4A3F35]/30 rounded-full px-3 py-1 md:px-4 md:py-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-lg md:text-xl text-[#4A3F35]">−</button>
                        <span className="font-bold text-[#4A3F35] text-sm md:text-base">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-lg md:text-xl text-[#4A3F35]">+</button>
                      </div>
                      <div className="text-right min-w-[70px] md:min-w-[100px]">
                        <p className="text-sm md:text-xl font-main text-[#4A3F35] whitespace-nowrap">{item.price * item.quantity} MDL</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="w-full lg:w-[450px] bg-[#DAC7B6]/30 p-8 md:p-10 rounded-[40px] h-fit lg:sticky lg:top-12 shadow-sm border border-[#4A3F35]/5">
            <h2 className="text-2xl font-main text-[#4A3F35] uppercase tracking-widest mb-6">
              {t('cart.checkoutTitle')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder={t('cart.placeholderName')}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#4A3F35]/30 py-2 outline-none text-[#4A3F35] placeholder:text-[#4A3F35]/40 text-xs tracking-widest focus:border-[#4A3F35] transition-colors"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('cart.placeholderPhone')}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#4A3F35]/30 py-2 outline-none text-[#4A3F35] placeholder:text-[#4A3F35]/40 text-xs tracking-widest focus:border-[#4A3F35] transition-colors"
                />
              </div>

              <div className="pt-2">
                <p className="text-[9px] text-[#4A3F35]/60 uppercase tracking-[0.2em] mb-1">{t('cart.labelAddress')}</p>
                <input
                  type="text"
                  name="address"
                  placeholder={t('cart.placeholderAddress')}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#4A3F35]/30 py-2 outline-none text-[#4A3F35] placeholder:text-[#4A3F35]/40 text-xs tracking-widest focus:border-[#4A3F35] transition-colors"
                />
              </div>

              <div className="pt-2">
                <p className="text-[9px] text-[#4A3F35]/60 uppercase tracking-[0.2em] mb-1">{t('cart.labelCard')}</p>
                <textarea
                  name="comment"
                  rows="2"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder={t('cart.placeholderComment')}
                  className="w-full bg-[#E6DBD1]/40 border border-[#4A3F35]/10 rounded-xl p-3 outline-none text-[#4A3F35] placeholder:text-[#4A3F35]/30 text-xs focus:border-[#4A3F35]/30 transition-colors resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#4A3F35]/10 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#4A3F35]/60 uppercase tracking-widest">{t('cart.toPay')}</span>
                  <span className="text-2xl font-bold text-[#4A3F35]">{totalPrice} MDL</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#4A3F35] text-[#E6DBD1] py-4 rounded-full mt-4 uppercase tracking-[0.2em] text-[10px] font-bold transition-all shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'}`}
              >
                {isSubmitting ? t('cart.submitProcessing') : t('cart.submitConfirm')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
