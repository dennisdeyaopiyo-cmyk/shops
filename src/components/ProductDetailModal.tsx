import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  pickupAddress: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  pickupAddress,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleIncrement = () => {
    if (product.stockCount && quantity >= product.stockCount) return;
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#2d2a26]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-content"
        className="bg-[#fdfbf7] max-w-lg w-full overflow-hidden shadow-2xl border border-[#2d2a26]/20 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-[#fdfbf7]/90 text-[#2d2a26] hover:bg-[#2d2a26] hover:text-[#fdfbf7] border border-[#2d2a26]/20 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-16/10 bg-[#e8e4de] border-b border-[#2d2a26]/10 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {product.badge && (
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-[#2d2a26] text-[#fdfbf7] font-medium shadow-xs">
                {product.badge}
              </span>
            )}
            <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-[#fdfbf7]/90 text-[#2d2a26] font-medium border border-[#2d2a26]/10">
              {product.category}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif italic text-2xl sm:text-3xl text-[#2d2a26] leading-tight">
                {product.name}
              </h2>
              <p className="text-[10px] uppercase tracking-widest font-medium text-[#2d2a26]/60 mt-1">
                {product.unit}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-serif text-3xl text-[#2d2a26]">
                ${product.price.toFixed(2)}
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-[#2d2a26]/50 mt-0.5">
                {product.inStock ? 'Ready for pickup' : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4 pt-4 border-t border-[#2d2a26]/10">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2d2a26]/50 mb-1.5">
              Product Description
            </h4>
            <p className="text-xs text-[#2d2a26]/80 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Local neighbor assurance notes */}
          <div className="mt-4 p-3 bg-[#f5f2ed] border border-[#2d2a26]/15 text-xs text-[#2d2a26]/80 space-y-1.5">
            <div className="flex items-center gap-2 text-[#2d2a26] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2d2a26] shrink-0" />
              <span>Neighbor guarantee • No online payment required</span>
            </div>
            <div className="flex items-center gap-2 text-[#2d2a26]/70">
              <MapPin className="w-3.5 h-3.5 text-[#2d2a26]/70 shrink-0" />
              <span>Pickup from porch at {pickupAddress}</span>
            </div>
          </div>

          {/* Quantity and Actions */}
          {product.inStock ? (
            <div className="mt-6 pt-4 border-t border-[#2d2a26]/10 flex items-center justify-between gap-4">
              <div className="flex items-center bg-[#f5f2ed] border border-[#2d2a26]/20">
                <button
                  id="qty-decrement-btn"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="p-2 text-[#2d2a26] hover:bg-[#2d2a26] hover:text-[#fdfbf7] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#2d2a26] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-serif text-sm text-[#2d2a26]">
                  {quantity}
                </span>
                <button
                  id="qty-increment-btn"
                  onClick={handleIncrement}
                  className="p-2 text-[#2d2a26] hover:bg-[#2d2a26] hover:text-[#fdfbf7] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                id="modal-add-to-cart-btn"
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2d2a26] hover:bg-[#2d2a26]/90 text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium transition-colors cursor-pointer border border-[#2d2a26]"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Reserve {quantity} for ${(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>
          ) : (
            <div className="mt-6 pt-4 border-t border-[#2d2a26]/10 text-center">
              <p className="text-xs uppercase tracking-widest text-[#2d2a26]/60 py-2">
                This item is currently sold out
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
