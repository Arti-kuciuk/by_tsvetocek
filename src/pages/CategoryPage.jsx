import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { supabase } from '../backend/supabaseClient'; // Проверь правильность пути к файлу

export default function CategoryPage() {
  const { categoryName } = useParams(); // Получаем 'flowers' или 'bouquets' из URL
  const { addToCart } = useCart();
  
  // 1. Создаем состояния для товаров и индикатора загрузки
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Делаем запрос в базу при загрузке страницы или смене категории
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true); // Включаем индикатор загрузки
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        // 3. Магия Supabase: фильтруем товары прямо в базе данных!
        .eq('category', categoryName); 

      if (error) {
        console.error('Ошибка загрузки категории:', error);
      } else {
        setProducts(data); // Сохраняем полученные товары
      }
      
      setLoading(false); // Выключаем индикатор загрузки
    };

    fetchProductsByCategory();
  }, [categoryName]); // 4. ВАЖНО: React перезапустит запрос, если categoryName в URL изменится

  // Заголовок страницы в зависимости от категории
  const titles = {
    flowers: "Свежие цветы",
    bouquets: "Авторские букеты",
    events: "Оформление мероприятий"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-main mb-12 text-center capitalize">
        {titles[categoryName] || "Каталог"}
      </h1>

      {/* 5. Если грузится — показываем текст, если загрузилось — показываем сетку */}
      {loading ? (
        <p className="text-center opacity-50 text-xl font-main">Загрузка товаров...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                // 6. Не забываем про новые названия колонок и ID со складом
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