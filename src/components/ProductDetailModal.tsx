import { X, ShoppingCart, Truck, Store, Shield, Star } from 'lucide-react';
import { Product } from '../types';
import { InstallmentCalculator } from './InstallmentCalculator';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#F0F4F8] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#F0F4F8] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-[#003366]">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F0F4F8] rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column - Image */}
            <div>
              <div className="bg-white rounded-lg p-8 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.badges?.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-[#FF6600] text-white px-3 py-1 rounded"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Service features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                  <Truck className="w-6 h-6 text-[#003366]" />
                  <div>
                    <p className="text-[#1A1A1A]">Free Delivery</p>
                    <p className="text-[#666666] text-xs">Within 3-5 days</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                  <Store className="w-6 h-6 text-[#003366]" />
                  <div>
                    <p className="text-[#1A1A1A]">Store Pickup</p>
                    <p className="text-[#666666] text-xs">Available</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-[#00C851]" />
                  <div>
                    <p className="text-[#1A1A1A]">Warranty</p>
                    <p className="text-[#666666] text-xs">{product.warranty}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                  <Star className="w-6 h-6 text-[#FF6600]" />
                  <div>
                    <p className="text-[#1A1A1A]">Rating</p>
                    <p className="text-[#666666] text-xs">{product.rating} / 5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Details */}
            <div className="space-y-6">
              {/* Product info */}
              <div className="bg-white rounded-lg p-6">
                <p className="text-[#666666] mb-2">{product.brand}</p>
                <h1 className="text-[#1A1A1A] mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[#FF6600] text-xl">
                        {i < Math.floor(product.rating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-[#666666]">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {product.oldPrice && (
                    <p className="text-[#666666] line-through">
                      {product.oldPrice.toLocaleString()} EGP
                    </p>
                  )}
                  <p className="text-[#003366]">
                    {product.price.toLocaleString()} EGP
                  </p>
                  {product.oldPrice && (
                    <p className="text-[#00C851]">
                      Save {((product.oldPrice - product.price) / product.oldPrice * 100).toFixed(0)}%
                    </p>
                  )}
                </div>

                {/* Stock status */}
                {product.inStock ? (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-[#00C851] rounded-full"></div>
                    <span className="text-[#00C851]">In Stock</span>
                    {product.lowStock && (
                      <span className="text-[#FF4444]">(Only few left!)</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-[#FF4444] rounded-full"></div>
                    <span className="text-[#FF4444]">Out of Stock</span>
                  </div>
                )}

                {/* Add to cart button */}
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={!product.inStock}
                  className="w-full bg-[#FF6600] hover:bg-[#FF6600]/90 disabled:bg-[#666666] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              {/* Technical specs */}
              {product.specs && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-[#003366] mb-4">Technical Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-[#F0F4F8] last:border-0">
                        <span className="text-[#666666]">{key}</span>
                        <span className="text-[#1A1A1A]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Installment Calculator */}
              <InstallmentCalculator productPrice={product.price} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
