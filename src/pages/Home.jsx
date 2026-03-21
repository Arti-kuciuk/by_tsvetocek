import React, { useEffect, useState } from 'react';
import DailyBloom from '../components/DailyBloom';
import ProductCard from '../components/ProductCard';
import Events from '../components/Events';
import FloatingCart from '../components/FloatingCart';
import Gifts from '../components/Gifts';
import { useCart } from '../context/CartContext';
import { supabase } from '../backend/supabaseClient';

export default function Home() {
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

      {/* DAILY BLOOM */}
      <DailyBloom />

      {/* ТОП ПРОДАЖ */}
      <div className='flex items-start px-6 md:px-16 mt-8'>
        <h1 className='font-main text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>Топ продаж</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-8 md:px-16 px-6 py-8">
        {dbProducts.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id} 
            image={product.image_url} 
            title={product.title_ru} 
            price={product.price}
            stock={product.stock_count} 
            onAdd={() => addToCart({
              id: product.id, 
              title: product.title_ru,
              price: product.price,
              image: product.image_url,
              stock: product.stock_count
            })}
          />
        ))}
      </div>

      {/* МЕРОПРИЯТИЯ */}
      <div className='flex items-start px-6 md:px-16 pt-4'>
        <h1 className='text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>Мероприятия</h1>
      </div>

      <Events />


      {/* ПОДАРКИ */}
      <div className='flex items-start px-6 md:px-16 pt-4'>
        <h1 className='text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>Подарки</h1>
      </div>

      <Gifts />

      {/* ПЛАВАЮЩАЯ КОРЗИНА */}
      <FloatingCart />

    </div>
  );
}