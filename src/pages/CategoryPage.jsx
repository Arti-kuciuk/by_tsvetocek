import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products.json';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function CategoryPage() {
  const { categoryName } = useParams(); // Получаем 'flowers' или 'bouquets' из URL
  const { addToCart } = useCart();

  // Фильтруем товары по категории
  const filteredProducts = products.filter(item => item.category === categoryName);

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id}
            image={product.image}
            title={product.title_ru}
            price={product.price}
            onAdd={() => addToCart({
              title: product.title_ru,
              price: product.price,
              image: product.image
            })}
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <p className="text-center opacity-50">В этой категории пока нет товаров.</p>
      )}
    </div>
  );
}