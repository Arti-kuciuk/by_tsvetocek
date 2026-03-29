import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DailyBloom from '../components/DailyBloom';
import ProductCard from '../components/ProductCard';
import Events from '../components/Events';
import FloatingCart from '../components/FloatingCart';
import Gifts from '../components/Gifts';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { supabase } from '../backend/supabaseClient';
import { getProductTitle } from '../utils/productLocale';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sales_count', { ascending: false })
        .limit(4); 
  
      if (error) {
        console.error('Ошибка:', error);
      } else {
        setDbProducts(data);
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <div className='min-h-screen bg-[#E6DBD1]'>
      <SEO 
        title={t('home.title')} 
        description={t('home.description')} 
      />

      {/* DAILY BLOOM */}
      <DailyBloom />

      {/* ТОП ПРОДАЖ */}
      <div className='flex items-start px-6 md:px-16 mt-8'>
        <h1 className='font-main text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>{t('home.topSales')}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-6 md:px-16 px-4 py-4 md:py-8">
        {dbProducts.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id} 
            image={product.image_url} 
            title={getProductTitle(product, i18n.language)} 
            price={product.price}
            stock={product.stock_count} 
            onAdd={() => addToCart({
              id: product.id, 
              title_ru: product.title_ru,
              title_ro: product.title_ro,
              price: product.price,
              image: product.image_url,
              stock: product.stock_count
            })}
          />
        ))}
      </div>

      {/* МЕРОПРИЯТИЯ */}
      <div className='flex items-start px-6 md:px-16 pt-4'>
        <h1 className='text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>{t('home.events')}</h1>
      </div>

      <Events />


      {/* ПОДАРКИ */}
      <div className='flex items-start px-6 md:px-16 pt-4'>
        <h1 className='text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>{t('home.gifts')}</h1>
      </div>

      <Gifts />

      {/* ПЛАВАЮЩАЯ КОРЗИНА */}
      <FloatingCart />

    </div>
  );
}