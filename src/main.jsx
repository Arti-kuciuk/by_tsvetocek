import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext' 

// Страницы
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import CategoryPage from './pages/CategoryPage'

// Компоненты
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SubNavbar from './components/SubNavbar'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        
        {/* Оболочка приложения для правильного прижатия футера */}
        <div className="flex flex-col min-h-screen">
          
          <Navbar />

          <SubNavbar />

          {/* flex-grow заставляет этот блок занимать все свободное место, 
              выталкивая футер вниз, если контента мало */}
          <main className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
        
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>,
)
