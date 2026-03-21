import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { supabase } from '../backend/supabaseClient'; 
import SEO from '../components/SEO';
export default function CategoryPage() {
  const { categoryName } = useParams(); 
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true); 
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryName); 

      if (error) {
        console.error('Ошибка загрузки категории:', error);
      } else {
        setProducts(data); 
      }
      
      setLoading(false); 
    };

    fetchProductsByCategory();
  }, [categoryName]); 

  // Добавили подарки в словарь заголовков
  const titles = {
    flowers: "Свежие цветы",
    bouquets: "Авторские букеты",
    events: "Оформление мероприятий",
    gifts: "Подарки и сувениры" // <--- ДОБАВЛЕНО
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO 
        title={titles[categoryName] || "Каталог"} 
        description={`Посмотрите наши ${titles[categoryName] || "товаров"} в категории ${categoryName}.`} 
      />
        <h1 className="text-4xl font-main mb-12 text-center capitalize">
        {titles[categoryName] || "Каталог"}
      </h1>

      {loading ? (
        <p className="text-center opacity-50 text-xl font-main">Загрузка товаров...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
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
          
          {products.length === 0 && (
            <p className="text-center opacity-50 mt-8">В этой категории пока нет товаров.</p>
          )}
        </>
      )}
    </div>
  );
}