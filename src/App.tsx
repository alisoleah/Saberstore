import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSlider } from './components/HeroSlider';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartModal } from './components/CartModal';
import { CountdownTimer } from './components/CountdownTimer';
import { CreditLimitChecker } from './components/CreditLimitChecker';
import { CheckoutFlow } from './components/CheckoutFlow';
import { mockProducts } from './data/mockData';
import { Product, CartItem } from './types';

type Page = 'home' | 'credit-check' | 'checkout';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    setShowCart(false);
    setCurrentPage('checkout');
  };

  const handleCheckoutComplete = () => {
    setCartItems([]);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setShowCart(true)}
        onLoginClick={() => setCurrentPage('credit-check')}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="container mx-auto px-4 py-8 space-y-12">
            {/* Hero Slider */}
            <HeroSlider />

            {/* Category Grid */}
            <section>
              <h2 className="text-[#003366] mb-6">Shop by Category</h2>
              <CategoryGrid />
            </section>

            {/* Flash Deals Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#003366]">⚡ Flash Deals</h2>
                <CountdownTimer />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onClick={setSelectedProduct}
                  />
                ))}
              </div>
            </section>

            {/* Best Selling Installment Deals */}
            <section>
              <h2 className="text-[#003366] mb-6">💰 Best Installment Deals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onClick={setSelectedProduct}
                  />
                ))}
              </div>
            </section>

            {/* CTA Banner */}
            <section>
              <div className="bg-gradient-to-r from-[#003366] to-[#004488] rounded-lg p-12 text-center text-white">
                <h2 className="text-white mb-4">Get Your Credit Limit Now!</h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Complete your KYC verification in minutes and unlock 0% installment plans on all products
                </p>
                <button
                  onClick={() => setCurrentPage('credit-check')}
                  className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white px-8 py-3 rounded-lg transition-colors"
                >
                  Check Credit Limit
                </button>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'credit-check' && (
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={() => setCurrentPage('home')}
              className="mb-6 text-[#003366] hover:text-[#FF6600] transition-colors"
            >
              ← Back to Home
            </button>
            <CreditLimitChecker />
          </div>
        )}

        {currentPage === 'checkout' && (
          <div className="container mx-auto px-4 py-8">
            <CheckoutFlow
              items={cartItems}
              onComplete={handleCheckoutComplete}
              onBack={() => setCurrentPage('home')}
            />
          </div>
        )}
      </main>

      <Footer />

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {showCart && (
        <CartModal
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}
