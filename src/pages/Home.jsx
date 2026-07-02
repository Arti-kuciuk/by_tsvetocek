import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import { getTopInStock } from '../utils/productStock';
import { buildLocalBusinessSchema } from '../utils/structuredData';

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
        .limit(20);

      if (error) {
        console.error('Ошибка:', error);
      } else {
        setDbProducts(getTopInStock(data ?? [], 4));
      }
    };
  
    fetchProducts();
  }, []);

  return (
    <div className='min-h-screen bg-[#E6DBD1]'>
      <SEO 
        description={t('home.description')}
        url="/"
        jsonLd={buildLocalBusinessSchema(t)}
      />

      <h1 className="sr-only">{t('seo.defaultTitle')}</h1>

      {/* DAILY BLOOM */}
      <DailyBloom />

      {/* ТОП ПРОДАЖ */}
      <div className='flex items-start px-6 md:px-16 mt-0 md:mt-8'>
        <h2 className='font-main text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>
          {t('home.topSales')}
        </h2>
      </div>

      <div className="overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-4 md:px-16 px-4 py-4 md:py-8">
          {dbProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: i * 0.08
              }}
            >
              <ProductCard
                id={product.id}
                image={product.image_url}
                title={getProductTitle(product, i18n.language)}
                price={product.price}
                stock={product.stock_count}
                onAdd={() =>
                  addToCart({
                    id: product.id,
                    title_ru: product.title_ru,
                    title_ro: product.title_ro,
                    title_en: product.title_en,
                    price: product.price,
                    image: product.image_url,
                    stock: product.stock_count,
                  })
                }
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* МЕРОПРИЯТИЯ */}
      <div className='flex items-start px-6 md:px-16 pt-4'>
        <h2 className='text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>{t('home.events')}</h2>
      </div>

      <Events />


      {/* ПОДАРКИ */}
      <div className='flex items-start px-6 md:px-16 pt-4'>
        <h2 className='text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>{t('home.gifts')}</h2>
      </div>

      <Gifts />

      {/* ПЛАВАЮЩАЯ КОРЗИНА */}
      <FloatingCart />

    </div>
  );
}