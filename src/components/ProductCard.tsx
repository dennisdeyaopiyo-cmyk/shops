import React from 'react';
import { Plus, Check, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  quantityInCart?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  quantityInCart = 0,
}) => {
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className={`group bg-[#f5f2ed] border p-4 transition-all duration-200 flex flex-col h-full cursor-pointer ${
        product.inStock
          ? 'border-[#2d2a26]/20 hover:border-[#2d2a26]/50 hover:shadow-xs'
          : 'border-[#2d2a26]/10 opacity-75'
      }`}
    >
      {/* Image container with badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#e8e4de] mb-3.5 border border-[#2d2a26]/10">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
            !product.inStock ? 'grayscale-[50%]' : ''
          }`}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 items-center">
          {product.badge && (
            <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-[#2d2a26] text-[#fdfbf7] font-medium shadow-xs">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-[#2d2a26]/80 text-[#fdfbf7] font-medium shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Category tag on image corner */}
        <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[9px] uppercase tracking-widest bg-[#fdfbf7]/90 backdrop-blur-xs text-[#2d2a26] font-medium border border-[#2d2a26]/10">
          {product.category}
        </span>

        {/* Quick view icon on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="p-1.5 bg-[#fdfbf7]/90 text-[#2d2a26] hover:bg-[#2d2a26] hover:text-[#fdfbf7] transition-colors border border-[#2d2a26]/20 flex items-center justify-center">
            <Eye className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1">
        {/* Title & Price Header */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-serif italic text-lg sm:text-xl text-[#2d2a26] group-hover:opacity-80 transition-opacity line-clamp-1">
            {product.name}
          </h3>
          <span className="font-serif text-lg text-[#2d2a26] shrink-0">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Unit */}
        <p className="text-[10px] uppercase tracking-widest text-[#2d2a26]/60 font-medium mb-2">
          {product.unit}
        </p>

        {/* Description */}
        <p className="text-xs text-[#2d2a26]/70 leading-relaxed mb-4 flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Action Button */}
        <div className="pt-2 border-t border-[#2d2a26]/10 mt-auto">
          {product.inStock ? (
            <button
              id={`add-btn-${product.id}`}
              onClick={handleAdd}
              className={`w-full py-2 px-3 text-[10px] uppercase tracking-widest font-medium border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                justAdded
                  ? 'bg-[#2d2a26] text-[#fdfbf7] border-[#2d2a26]'
                  : 'border-[#2d2a26] text-[#2d2a26] hover:bg-[#2d2a26] hover:text-[#fdfbf7]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Reserved</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Reserve</span>
                  {quantityInCart > 0 && (
                    <span className="ml-1 bg-[#2d2a26] text-[#fdfbf7] group-hover:bg-[#fdfbf7] group-hover:text-[#2d2a26] text-[9px] font-bold px-1.5 py-0.2 border border-current">
                      {quantityInCart}
                    </span>
                  )}
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2 text-[10px] uppercase tracking-widest font-medium border border-[#2d2a26]/20 text-[#2d2a26]/40 cursor-not-allowed bg-[#2d2a26]/5"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
