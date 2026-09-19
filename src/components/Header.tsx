import React from 'react';
import { ShoppingBag, MapPin, Clock, Search, SlidersHorizontal, ClipboardList, Store } from 'lucide-react';
import { ShopInfo } from '../types';

interface HeaderProps {
  shopInfo: ShopInfo;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenManager: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

export const Header: React.FC<HeaderProps> = ({
  shopInfo,
  cartCount,
  onOpenCart,
  onOpenOrders,
  onOpenManager,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  return (
    <header className="bg-[#fdfbf7] border-b border-[#2d2a26]/15 sticky top-0 z-30">
      {/* Top neighbor community announcement banner */}
      <div className="bg-[#f5f2ed] border-b border-[#2d2a26]/10 text-[#2d2a26]/80 text-[10px] uppercase tracking-widest font-medium px-4 py-2">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2d2a26] animate-pulse" />
            <span>Neighbor Direct • Pay upon pickup or doorstep collection</span>
          </div>
          <div className="flex items-center gap-4 text-[#2d2a26]/70">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#2d2a26]" />
              {shopInfo.houseAddress}
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#2d2a26]" />
              {shopInfo.pickupHours}
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#2d2a26]/15 pb-4">
          {/* Brand & Local Shop Name (Editorial Masthead Style) */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-4xl font-serif italic font-light tracking-tight text-[#2d2a26]">
                {shopInfo.name}
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] mt-1 text-[#2d2a26]/60 font-medium">
                {shopInfo.tagline}
              </p>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                id="mobile-cart-btn"
                onClick={onOpenCart}
                className="relative p-2.5 border border-[#2d2a26] bg-[#2d2a26] text-[#fdfbf7] hover:bg-[#2d2a26]/90 transition-colors"
                aria-label="View Order Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#f5f2ed] text-[#2d2a26] border border-[#2d2a26] text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Action buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              id="view-orders-btn"
              onClick={onOpenOrders}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-widest font-medium text-[#2d2a26]/80 hover:text-[#2d2a26] border border-[#2d2a26]/20 hover:border-[#2d2a26] bg-[#f5f2ed]/60 transition-colors"
              title="View placed orders & reservations"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#2d2a26]/60" />
              <span>Reservations</span>
            </button>

            <button
              id="shop-manager-btn"
              onClick={onOpenManager}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-widest font-medium text-[#2d2a26]/80 hover:text-[#2d2a26] border border-[#2d2a26]/20 hover:border-[#2d2a26] bg-[#f5f2ed]/60 transition-colors"
              title="Edit items, prices, or pickup address"
            >
              <Store className="w-3.5 h-3.5 text-[#2d2a26]/60" />
              <span>Seller Tools</span>
            </button>

            <button
              id="desktop-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 border border-[#2d2a26] bg-[#2d2a26] text-[#fdfbf7] hover:bg-[#2d2a26]/90 text-[11px] uppercase tracking-widest font-medium transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Neighbor Bag</span>
              <span className="bg-[#f5f2ed] text-[#2d2a26] border border-[#2d2a26] text-[10px] font-bold px-1.5 py-0.2 ml-1">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Search and Category navigation bar */}
        <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#2d2a26]/40" />
            <input
              id="catalog-search-input"
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f5f2ed] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] transition-colors placeholder:text-[#2d2a26]/40 text-[#2d2a26]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-[#2d2a26]/50 hover:text-[#2d2a26] px-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-4 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none text-[11px] uppercase tracking-wider font-medium">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onSelectCategory(cat)}
                  className={`pb-1 whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'border-b-2 border-[#2d2a26] text-[#2d2a26] font-semibold'
                      : 'border-b-2 border-transparent text-[#2d2a26]/60 hover:text-[#2d2a26]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Quick mobile seller actions */}
          <div className="flex sm:hidden items-center justify-between gap-2 pt-1 border-t border-[#2d2a26]/10 text-[10px] uppercase tracking-widest text-[#2d2a26]/70">
            <button
              onClick={onOpenOrders}
              className="flex items-center gap-1 py-1 hover:text-[#2d2a26]"
            >
              <ClipboardList className="w-3 h-3" />
              <span>Reservations</span>
            </button>
            <button
              onClick={onOpenManager}
              className="flex items-center gap-1 py-1 hover:text-[#2d2a26]"
            >
              <Store className="w-3 h-3" />
              <span>Seller Tools</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
