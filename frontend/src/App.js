import { ReactLenis, useLenis } from 'lenis/react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Pages
import Footer from './components/Footer';
import Header from './components/Header';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AddProductPage from './pages/AddProductPage';
import AdminPage from './pages/AdminPage';
import ArtworkPage from './pages/ArtworkPage';
import BandsPage from './pages/BandsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';
import SuccessPage from './pages/SuccessPage';

// Components

// Context

function App() {
  useLenis((lenis) => {
    window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: { scroll: lenis.scroll } }));
  });
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="app">
          <Header />
          <ReactLenis root options={{ duration: 0.6, easing: (t) => 1 - Math.pow(1 - t, 3), smoothTouch: true }} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/artwork" element={<ArtworkPage />} />
              <Route path="/bands" element={<BandsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/add-product" element={<AddProductPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;