import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { HelmetProvider } from 'react-helmet-async'; 
import { Analytics } from '@vercel/analytics/react';

// Страницы
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import CategoryPage from './pages/CategoryPage'
import AdminPage from './pages/AdminPage'
import ProductPage from './pages/ProductPage'
import EventsPage from './pages/EventsPage'

// Компоненты
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SubNavbar from './components/SubNavbar'
import PageTransition from './components/PageTransition'

import './index.css'
import './i18n.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <HelmetProvider>
      <BrowserRouter>
        <PageTransition>
          <ScrollToTop />

          <div className="flex flex-col min-h-screen">
            <Navbar />
            <SubNavbar />

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/admin-tsv" element={<AdminPage />} />
                <Route path="/events" element={<EventsPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </PageTransition>

        <Analytics />
        
      </BrowserRouter>
      </HelmetProvider>
    </CartProvider>
  </React.StrictMode>,
)
