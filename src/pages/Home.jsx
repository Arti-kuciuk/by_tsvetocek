import DailyBloom from '../components/DailyBloom'
import ProductCard from '../components/ProductCard'
import Events from '../components/Events'
import FloatingCart from '../components/FloatingCart'
import { useCart } from '../context/CartContext'
import products from '../data/products.json'

export default function Home() {
  const { addToCart } = useCart();

  return (
    <div className='min-h-screen bg-[#E6DBD1]'>

      <DailyBloom />

      <div className='flex items-start px-6 md:px-16'>
        <h1 className='font-main text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>Топ продаж</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-8 md:px-16 px-6 py-8">
        {products.map((product) => (
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

      <div className='flex items-start px-6 md:px-16 pt-4'>
        <h1 className='text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>Мероприятия</h1>
      </div>

      <Events />

      <FloatingCart />
    </div>
  )
}