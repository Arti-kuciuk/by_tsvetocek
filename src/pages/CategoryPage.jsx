import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { supabase } from '../backend/supabaseClient'; 
import SEO from '../components/SEO';
import { getProductTitle } from '../utils/productLocale';

const CATEGORY_KEYS = ['flowers', 'bouquets', 'events', 'gifts'];

export default function CategoryPage() {
  const { t, i18n } = useTranslation();
  const { categoryName } = useParams(); 
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayTitle = categoryName && CATEGORY_KEYS.includes(categoryName)
    ? t(`category.titles.${categoryName}`)
    : t('category.catalogFallback');

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO 
        title={displayTitle} 
        description={t('category.seoDescription', { title: displayTitle })} 
      />
      
        <h1 className="text-4xl font-main mb-12 text-center capitalize">
        {displayTitle}
      </h1>

      {loading ? (
        <p className="text-center opacity-50 text-xl font-main">{t('category.loading')}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map(product => (
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
          
          {products.length === 0 && (
            <p className="text-center opacity-50 mt-8">{t('category.empty')}</p>
          )}
        </>
      )}
    </div>
  );
}
