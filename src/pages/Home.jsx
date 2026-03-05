import Navbar from '../components/Navbar'
import DailyBloom from '../components/DailyBloom'
import SubNavbar from '../components/SubNavbar'
import ProductCard from '../components/ProductCard'
import Events from '../components/Events'
import FloatingCart from '../components/FloatingCart'
import { useCart } from '../context/CartContext'

export default function Home() {
  const { addToCart } = useCart();

  return (
    <div className='min-h-screen bg-[#E6DBD1]'>
      <Navbar />

      <SubNavbar />

      <DailyBloom />

      <div className='flex items-start px-6 md:px-16'>
        <h1 className='font-main text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>Топ продаж</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-8 gap-8 md:px-16 px-6 py-8">
        <ProductCard 
          image="flowers/roses.jpg" 
          title="букет белых роз" 
          price={500} 
          onAdd={() => addToCart({ 
            title: "букет белых роз", 
            price: 500, 
            image: "flowers/roses.jpg" 
          })}
        />

        <ProductCard 
          image="flowers/tulips.jpg" 
          title="красные тюльпаны" 
          price={350} 
          onAdd={() => addToCart({ 
            title: "красные тюльпаны", 
            price: 350, 
            image: "flowers/tulips.jpg" 
          })}
        />
        
      </div>

      <div className='flex items-start px-6 md:px-16 pt-4'>
        <h1 className='text-[#4A3F35] text-4xl md:text-5xl tracking-wider'>Мероприятия</h1>
      </div>

      <Events />

      <FloatingCart />
    </div>
  )
}