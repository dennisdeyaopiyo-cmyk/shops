import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, ShopInfo } from './types';
import { initialProducts, initialShopInfo } from './data/initialProducts';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrdersModal } from './components/OrdersModal';
import { ShopManagerModal } from './components/ShopManagerModal';
import { ShoppingBag, Search, Sparkles, HeartHandshake, CheckCircle2 } from 'lucide-react';

const STORAGE_PRODUCTS_KEY = 'neighborhood_shop_products_v1';
const STORAGE_SHOP_INFO_KEY = 'neighborhood_shop_info_v1';
const STORAGE_ORDERS_KEY = 'neighborhood_shop_orders_v1';
const STORAGE_CART_KEY = 'neighborhood_shop_cart_v1';

export default function App() {
  // 1. Shop and Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [shopInfo, setShopInfo] = useState<ShopInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SHOP_INFO_KEY);
      return saved ? JSON.parse(saved) : initialShopInfo;
    } catch {
      return initialShopInfo;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SHOP_INFO_KEY, JSON.stringify(shopInfo));
  }, [shopInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Derived categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['All Items', ...list];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All Items' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = !showInStockOnly || product.inStock;

      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [products, selectedCategory, searchQuery, showInStockOnly]);

  // Total items in cart
  const cartTotalCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Order management
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Product management
  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const productWithId: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [productWithId, ...prev]);
  };

  const handleToggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleResetDefaultProducts = () => {
    if (window.confirm('Reset catalog products to default demo goods?')) {
      setProducts(initialProducts);
      setShopInfo(initialShopInfo);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#2d2a26]">
      {/* Navigation & Header */}
      <Header
        shopInfo={shopInfo}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenManager={() => setIsManagerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Editorial Feature Section (Simple. Local. Fresh.) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2d2a26]/50 mb-3 block">
              Neighborhood Provisions
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-4 text-[#2d2a26]">
              Simple.<br />
              Local.<br />
              <span className="italic font-light">Fresh.</span>
            </h2>
            <p className="text-sm text-[#2d2a26]/80 max-w-md leading-relaxed mb-6">
              Curated everyday goods and homemade staples for our street. Browse the catalog, reserve your items without paying online, and swing by for pickup.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-grid-start');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#2d2a26] text-[#fdfbf7] text-[10px] uppercase tracking-widest px-5 py-2.5 font-medium hover:bg-[#2d2a26]/90 transition-colors cursor-pointer"
              >
                Browse Catalog
              </button>
              <button
                onClick={() => setIsOrdersOpen(true)}
                className="border border-[#2d2a26] text-[#2d2a26] text-[10px] uppercase tracking-widest px-5 py-2.5 font-medium hover:bg-[#2d2a26]/5 transition-colors cursor-pointer"
              >
                View Active Orders ({orders.length})
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 border border-[#2d2a26]/20 p-6 bg-[#f5f2ed] flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#2d2a26]/60 block mb-1 font-medium">
                Today's Pickup Window
              </span>
              <div className="font-serif italic text-2xl text-[#2d2a26] mb-3">
                {shopInfo.pickupHours}
              </div>
              <p className="text-xs text-[#2d2a26]/75 leading-relaxed mb-4">
                Swing by {shopInfo.houseAddress}. Packages will be labeled with your house number. Payment can be made in cash upon pickup or via digital transfer.
              </p>

              {/* 3 Step Guidance */}
              <div className="border-t border-[#2d2a26]/10 pt-3 space-y-2 text-[11px] text-[#2d2a26]/80">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-[#2d2a26] text-[9px] font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Select & reserve items into your bag</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-[#2d2a26] text-[9px] font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Confirm with your name and house #</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-[#2d2a26] text-[9px] font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Collect at porch & settle payment</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#2d2a26]/10 pt-3 mt-4 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#2d2a26]/60 font-medium">
              <span>{shopInfo.houseAddress}</span>
              <span>Honor System</span>
            </div>
          </div>
        </section>

        {/* Catalog Subheader & Filter Stats */}
        <div id="catalog-grid-start" className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-6 pb-3 border-b border-[#2d2a26]/20">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2d2a26]/50 block">
              Current Offerings
            </span>
            <h2 className="font-serif italic text-2xl sm:text-3xl text-[#2d2a26] mt-0.5">
              {selectedCategory === 'All Items' ? 'Curated Catalog' : selectedCategory}
              <span className="text-sm font-sans font-normal text-[#2d2a26]/50 ml-3">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-medium text-[#2d2a26]/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#2d2a26] border-[#2d2a26]/40 cursor-pointer"
              />
              <span>In stock only</span>
            </label>

            {orders.length > 0 && (
              <button
                onClick={() => setIsOrdersOpen(true)}
                className="text-[11px] uppercase tracking-widest font-medium text-[#2d2a26] hover:opacity-70 flex items-center gap-1 border-b border-[#2d2a26] pb-0.5"
              >
                <span>{orders.length} Active {orders.length === 1 ? 'Order' : 'Orders'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((i) => i.product.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={setSelectedProductForDetail}
                  quantityInCart={cartItem?.quantity}
                />
              );
            })}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="text-center py-16 px-6 bg-[#f5f2ed] border border-[#2d2a26]/20 max-w-md mx-auto">
            <div className="w-10 h-10 border border-[#2d2a26]/20 text-[#2d2a26] flex items-center justify-center mx-auto mb-3">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="font-serif italic text-xl text-[#2d2a26]">
              No products found
            </h3>
            <p className="text-xs text-[#2d2a26]/70 mt-1 max-w-xs mx-auto leading-relaxed">
              No items matching &ldquo;{searchQuery}&rdquo; {selectedCategory !== 'All Items' ? `in ${selectedCategory}` : ''}.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Items');
                setShowInStockOnly(false);
              }}
              className="mt-4 px-4 py-2 border border-[#2d2a26] bg-[#2d2a26] text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium hover:bg-[#2d2a26]/90 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Floating Mobile Cart Indicator */}
      {cartTotalCount > 0 && !isCartOpen && (
        <aside
          aria-label="Neighbor Bag summary"
          className="sm:hidden fixed bottom-5 left-4 right-4 z-40"
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#2d2a26] text-[#fdfbf7] p-3.5 shadow-xl flex items-center justify-between border border-[#2d2a26] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#fdfbf7]" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#f5f2ed] text-[#2d2a26] font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#2d2a26]">
                  {cartTotalCount}
                </span>
              </div>
              <span className="text-xs uppercase tracking-widest font-medium">Neighbor Bag</span>
            </div>
            <span className="text-xs font-serif italic text-[#fdfbf7]">
              ${cart.reduce((s, i) => s + i.product.price * i.quantity, 0).toFixed(2)} →
            </span>
          </button>
        </aside>
      )}

      {/* Modals and Drawers */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart}
        pickupAddress={shopInfo.houseAddress}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        shopInfo={shopInfo}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onUpdateStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
      />

      <ShopManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onToggleStock={handleToggleStock}
        onDeleteProduct={handleDeleteProduct}
        onResetDefaultProducts={handleResetDefaultProducts}
        shopInfo={shopInfo}
        onUpdateShopInfo={setShopInfo}
      />

      {/* Editorial Footer */}
      <footer className="mt-auto border-t border-[#2d2a26]/15 bg-[#fdfbf7] py-8 text-xs text-[#2d2a26]/70">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-serif italic font-medium text-sm text-[#2d2a26]">{shopInfo.name}</span>
            <span className="hidden sm:inline text-[#2d2a26]/30">•</span>
            <span className="text-[11px]">{shopInfo.houseAddress}</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-[#2d2a26]/50">
            Neighbor-to-neighbor catalog • Pay upon collection
          </p>
        </div>
      </footer>
    </div>
  );
}
