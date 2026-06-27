import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { supabase } from '../backend/supabaseClient'; 
import SEO from '../components/SEO';
import { getProductTitle } from '../utils/productLocale';
import { sortProductsByStock } from '../utils/productStock';
import FloatingCart from '../components/FloatingCart';

const CATEGORY_KEYS = ['flowers', 'bouquets', 'events', 'gifts'];
const STOCK_SORT_CATEGORIES = ['flowers', 'bouquets'];

export default function CategoryPage() {
  const { t, i18n } = useTranslation();
  const { categoryName } = useParams(); 
  const { addToCart } = useCart();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);

    update();
    mq.addEventListener('change', update);

    return () => mq.removeEventListener('change', update);
  }, []);
  
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
        const items = data ?? [];
        setProducts(
          STOCK_SORT_CATEGORIES.includes(categoryName)
            ? sortProductsByStock(items)
            : items
        );
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
        url={`/category/${categoryName}`}
      />

      <div className="md:px-16 px-6 pt-8 md:pt-10 mb-8 md:mb-12">
        <Link to="/" className="text-[#4A3F35]/70 text-[10px] md:text-sm uppercase tracking-[0.2em] hover:text-[#4A3F35] transition-colors flex items-center gap-2 w-fit border-b border-transparent hover:border-[#4A3F35]/30 pb-1">
          {t('category.back')}
        </Link>
      </div>
      
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-main mb-12 text-center capitalize"
      >
        {displayTitle}
      </motion.h1>

      {loading ? (
        <p className="text-center opacity-50 text-xl font-main">{t('category.loading')}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: isMobile ? 40 : 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: 'easeOut'
                }}
              >
                <ProductCard
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
              </motion.div>
            ))}
          </div>
          
          {products.length === 0 && (
            <p className="text-center opacity-50 mt-8">{t('category.empty')}</p>
          )}
        </>
      )}

      <FloatingCart />
      
    </div>
  );
}
