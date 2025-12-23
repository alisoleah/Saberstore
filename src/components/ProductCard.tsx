import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { calculateInstallment } from '../utils/installmentCalculator';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const installment = calculateInstallment(product.price, 0, 24);

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onClick?.(product)}
    >
      <div className="relative p-4">
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badges?.map((badge, index) => (
            <span
              key={index}
              className="bg-[#FF6600] text-white px-2 py-1 rounded text-xs"
            >
              {badge}
            </span>
          ))}
          {product.lowStock && (
            <span className="bg-[#FF4444] text-white px-2 py-1 rounded text-xs">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button 
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-[#F0F4F8] transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4 text-[#666666]" />
        </button>

        {/* Product image */}
        <div className="aspect-square flex items-center justify-center bg-white mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Brand */}
        <p className="text-[#666666] mb-1">{product.brand}</p>

        {/* Title */}
        <h3 className="text-[#1A1A1A] mb-2 line-clamp-2 h-12">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#FF6600]">
                {i < Math.floor(product.rating) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-[#666666]">({product.reviewCount})</span>
        </div>

        {/* Price block */}
        <div className="mb-3">
          {product.oldPrice && (
            <p className="text-[#666666] line-through">
              {product.oldPrice.toLocaleString()} EGP
            </p>
          )}
          <p className="text-[#003366]">
            {product.price.toLocaleString()} EGP
          </p>
        </div>

        {/* Installment highlight */}
        <div className="bg-gradient-to-r from-[#FFF4E6] to-[#FFE8CC] border border-[#FF6600]/30 rounded-lg p-3 mb-3">
          <p className="text-[#FF6600]">
            Or {installment.monthlyPayment.toLocaleString()} EGP / 24 months
          </p>
          <p className="text-[#666666] text-xs mt-1">0% Interest</p>
        </div>

        {/* Stock status */}
        {product.inStock ? (
          <p className="text-[#00C851] mb-3">In Stock</p>
        ) : (
          <p className="text-[#FF4444] mb-3">Out of Stock</p>
        )}

        {/* Add to cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          disabled={!product.inStock}
          className="w-full bg-[#FF6600] hover:bg-[#FF6600]/90 disabled:bg-[#666666] text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
