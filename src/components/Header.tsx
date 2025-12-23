import { useState } from 'react';
import { ShoppingCart, User, Phone, MapPin, Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onLoginClick?: () => void;
}

export function Header({ cartItemCount = 0, onCartClick, onLoginClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    'Large Appliances',
    'Small Appliances',
    'Mobiles',
    'Laptops',
    'TVs',
    'Air Conditioners',
    'Flash Deals'
  ];

  return (
    <header className="bg-[#003366] text-white sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">16000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Find Store</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={onLoginClick} className="text-sm hover:text-[#FF6600] transition-colors flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Login / Register</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <h1 className="text-white cursor-pointer">
              SaberStore
            </h1>
            
            {/* Search bar */}
            <div className="hidden md:flex items-center bg-white rounded-lg flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search for products, brands..."
                className="flex-1 px-4 py-2 rounded-l-lg outline-none text-[#1A1A1A]"
              />
              <button className="bg-[#FF6600] px-6 py-2 rounded-r-lg hover:bg-[#FF6600]/90 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart */}
          <button 
            onClick={onCartClick}
            className="relative bg-[#FF6600] hover:bg-[#FF6600]/90 transition-colors rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#00C851] text-white rounded-full w-6 h-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
            <span className="hidden md:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center bg-white rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-4 py-2 rounded-l-lg outline-none text-[#1A1A1A]"
          />
          <button className="bg-[#FF6600] px-4 py-2 rounded-r-lg">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden md:block bg-[#003366]/80 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto py-3">
            {categories.map((category, index) => (
              <a
                key={category}
                href="#"
                className={`text-sm whitespace-nowrap hover:text-[#FF6600] transition-colors ${
                  index === categories.length - 1 ? 'text-[#FF6600]' : ''
                }`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-[#002244] border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {categories.map((category, index) => (
                <a
                  key={category}
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-2 px-4 rounded-lg hover:bg-white/10 transition-colors ${
                    index === categories.length - 1 ? 'text-[#FF6600] bg-white/5' : ''
                  }`}
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}