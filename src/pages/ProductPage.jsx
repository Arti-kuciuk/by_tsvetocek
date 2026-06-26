import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../backend/supabaseClient';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import { getProductTitle, getProductDescription } from '../utils/productLocale';
import { getProductImage } from '../config/site';
import { buildProductSchema } from '../utils/structuredData';
import FloatingCart from '../components/FloatingCart';

export default function ProductPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);

    update();
    mq.addEventListener('change', update);

    return () => mq.removeEventListener('change', update);
  }, []);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single(); 

      if (error) {
        console.error('Ошибка загрузки товара:', error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock_count !== null && product.stock_count <= 0) {
      alert(t('product.noStockAlert'));
      return;
    }

    addToCart({
      id: product.id,
      title_ru: product.title_ru,
      title_ro: product.title_ro,
      price: product.price,
      image: (product.images && product.images.length > 0) ? product.images[0] : product.image_url,
      stock: product.stock_count,
      quantity: quantity
    });
  };

  const displayTitle = product ? getProductTitle(product, i18n.language) : '';
  const displayDescription = product
    ? getProductDescription(product, i18n.language, t('product.descriptionFallback'))
    : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6DBD1] p-16 font-main text-2xl text-[#4A3F35] text-center">
        <SEO title={t('product.loading')} url={`/product/${id}`} />
        {t('product.loading')}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#E6DBD1] p-16 font-main text-2xl text-[#4A3F35] text-center">
        <SEO title={t('product.notFound')} noindex url={`/product/${id}`} />
        {t('product.notFound')}
      </div>
    );
  }

  const productImage = getProductImage(product);

  return (
    <div className="min-h-screen bg-[#E6DBD1] text-[#4A3F35] pb-20">
      <SEO 
        title={displayTitle} 
        description={displayDescription}
        image={productImage}
        url={`/product/${id}`}
        type="product"
        jsonLd={buildProductSchema(product, displayTitle, displayDescription)}
      />  
      
      <div className="md:px-16 px-6 pt-8 md:pt-10 mb-6 md:mb-0">
        <Link to="/" className="text-[#4A3F35]/70 text-[10px] md:text-sm uppercase tracking-[0.2em] hover:text-[#4A3F35] transition-colors flex items-center gap-2 w-fit border-b border-transparent hover:border-[#4A3F35]/30 pb-1">
          {t('product.backToCatalog')}
        </Link>
      </div>

      {/* ГЛАВНЫЙ КОНТЕЙНЕР: items-stretch выравнивает колонки по высоте */}
      <div className="md:px-16 px-6 py-6 md:py-12 flex flex-col md:flex-row items-stretch gap-10 lg:gap-16">
        
        {/* ЛЕВАЯ КОЛОНКА */}
        <motion.div
          className="md:w-1/3 lg:w-[30%] w-full shrink-0 flex flex-col"
          initial={{ opacity: 0, x: isMobile ? 40 : 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {product.images && product.images.length > 0 ? (
            product.images.map((imgUrl, index) => (
              <div key={index} className="rounded-[30px] md:rounded-[40px] overflow-hidden border border-[#4A3F35]/5 shadow-sm relative aspect-[3/4] w-full mb-4">
                <img 
                  src={imgUrl} 
                  alt={`${displayTitle} - ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="rounded-[30px] md:rounded-[40px] overflow-hidden border border-[#4A3F35]/5 shadow-sm relative aspect-[3/4] w-full h-full">
              <img src={product.image_url} alt={displayTitle} className="w-full h-full object-cover" />
            </div>
          )}
        </motion.div>

        {/* ПРАВАЯ КОЛОНКА (Текст и кнопки): flex-col занимает всю высоту */}
        <motion.div
          className="flex-1 w-full flex flex-col"
          initial={{ opacity: 0, x: isMobile ? 60 : 120 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          
          {/* Верхняя часть с текстом */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-main uppercase leading-tight tracking-wide text-[#2D2A26]">
              {displayTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-4 border-t border-[#4A3F35]/20 pt-6">
              <p className="text-2xl md:text-3xl lg:text-4xl font-main text-[#2D2A26]">{product.price} MDL</p>
              {product.stock_count !== null && (
                <p className={`text-[10px] md:text-[11px] uppercase tracking-[0.15em] px-3 py-1 rounded-full font-bold ${product.stock_count > 0 ? 'bg-[#73826A]/20 text-[#43523A]' : 'bg-red-800/10 text-red-800'}`}>
                  {product.stock_count > 0 ? t('product.inStock', { count: product.stock_count }) : t('product.outOfStock')}
                </p>
              )}
            </div>

            <div className="text-sm md:text-base lg:text-lg text-[#2D2A26]/80 leading-relaxed whitespace-pre-line pb-8">
              {displayDescription}
            </div>
          </div>

          {/* Нижняя часть с кнопками: mt-auto прижимает этот блок к самому низу */}
          <div className="mt-auto pt-6 border-t border-[#4A3F35]/20 flex flex-col md:flex-row items-stretch gap-4 md:gap-6">
            
            <div className="w-full md:w-1/3 flex items-center justify-between border border-[#4A3F35] rounded-full bg-transparent px-5 py-3 md:py-0">
              <span className="text-[10px] md:text-xs text-[#2D2A26]/70 uppercase tracking-[0.2em] font-medium">{t('product.quantity')}</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-xl md:text-2xl text-[#2D2A26]/70 hover:text-[#2D2A26] transition-colors pb-1"
                >−</button>
                <span className="text-base md:text-lg font-main text-[#2D2A26] w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-xl md:text-2xl text-[#2D2A26]/70 hover:text-[#2D2A26] transition-colors pb-1"
                >+</button>
              </div>
            </div>

            {product.stock_count !== null && product.stock_count <= 0 ? (
              <button disabled className="btn-primary opacity-50 cursor-not-allowed flex-1 border-[#4A3F35]/50 text-[#4A3F35]/50 hover:bg-transparent hover:text-[#4A3F35]/50">
                {t('product.outOfStock')}
              </button>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="btn-primary flex-1 !m-0"
              >
                {t('product.addToCart')}
              </button>
            )}
          </div>

        </motion.div>

      </div>

      <FloatingCart />

    </div>
  );
}