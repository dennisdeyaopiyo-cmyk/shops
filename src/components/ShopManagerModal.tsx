import React, { useState } from 'react';
import { X, Plus, Trash2, Check, RefreshCw, Store, Sliders, Image as ImageIcon } from 'lucide-react';
import { Product, ShopInfo } from '../types';

interface ShopManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onToggleStock: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onResetDefaultProducts: () => void;
  shopInfo: ShopInfo;
  onUpdateShopInfo: (info: ShopInfo) => void;
}

export const ShopManagerModal: React.FC<ShopManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onToggleStock,
  onDeleteProduct,
  onResetDefaultProducts,
  shopInfo,
  onUpdateShopInfo,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'shopInfo'>('products');
  const [showAddForm, setShowAddForm] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState<Product['category']>('Fresh Produce');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('');

  // Shop Info form state
  const [shopName, setShopName] = useState(shopInfo.name);
  const [tagline, setTagline] = useState(shopInfo.tagline);
  const [houseAddress, setHouseAddress] = useState(shopInfo.houseAddress);
  const [pickupHours, setPickupHours] = useState(shopInfo.pickupHours);
  const [contactPhone, setContactPhone] = useState(shopInfo.contactPhone);
  const [pickupNote, setPickupNote] = useState(shopInfo.pickupNote);
  const [infoSaved, setInfoSaved] = useState(false);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    onAddProduct({
      name: name.trim(),
      description: description.trim() || 'Fresh local product for our neighbours.',
      price: parseFloat(price) || 0,
      unit: unit.trim() || 'each',
      category,
      inStock: true,
      badge: badge.trim() || undefined,
      image:
        image.trim() ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    });

    // Reset form
    setName('');
    setDescription('');
    setPrice('');
    setUnit('');
    setBadge('');
    setImage('');
    setShowAddForm(false);
  };

  const handleSaveShopInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShopInfo({
      name: shopName,
      tagline,
      houseAddress,
      pickupHours,
      contactPhone,
      pickupNote,
    });
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2000);
  };

  return (
    <div
      id="shop-manager-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#2d2a26]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="shop-manager-panel"
        className="bg-[#fdfbf7] text-[#2d2a26] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#2d2a26]/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2d2a26]/15 flex items-center justify-between bg-[#f5f2ed]">
          <div>
            <h3 className="font-serif italic text-xl text-[#2d2a26] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#2d2a26]" />
              <span>Seller Tools & Catalog Manager</span>
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-[#2d2a26]/60 mt-0.5">
              Manage your goods, descriptions, inventory, and porch pickup details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#2d2a26]/20 hover:bg-[#2d2a26] hover:text-[#fdfbf7] text-[#2d2a26] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2d2a26]/15 bg-[#fdfbf7] px-5 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-2.5 px-2 text-[10px] uppercase tracking-widest font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#2d2a26] text-[#2d2a26]'
                : 'border-transparent text-[#2d2a26]/50 hover:text-[#2d2a26]'
            }`}
          >
            Manage Goods ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('shopInfo')}
            className={`pb-2.5 px-2 text-[10px] uppercase tracking-widest font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'shopInfo'
                ? 'border-[#2d2a26] text-[#2d2a26]'
                : 'border-transparent text-[#2d2a26]/50 hover:text-[#2d2a26]'
            }`}
          >
            Shop & Pickup Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'products' ? (
            <div className="space-y-4">
              {/* Action Bar */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d2a26] hover:bg-[#2d2a26]/90 text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium transition-colors cursor-pointer border border-[#2d2a26]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddForm ? 'Cancel Adding' : 'Add New Item'}</span>
                </button>

                <button
                  onClick={onResetDefaultProducts}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#2d2a26]/60 hover:text-[#2d2a26] transition-colors py-1 px-2 border border-[#2d2a26]/20 bg-[#f5f2ed]"
                  title="Reset to sample products"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Demo Goods</span>
                </button>
              </div>

              {/* Add New Product Form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddSubmit}
                  className="p-4 bg-[#f5f2ed] border border-[#2d2a26]/15 space-y-3"
                >
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2d2a26]/70">
                    New Product Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sourdough Cinnamon Rolls"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Product['category'])}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                      >
                        <option value="Fresh Produce">Fresh Produce</option>
                        <option value="Bakery & Bread">Bakery & Bread</option>
                        <option value="Pantry & Preserves">Pantry & Preserves</option>
                        <option value="Eggs & Dairy">Eggs & Dairy</option>
                        <option value="Garden & Herbs">Garden & Herbs</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        required
                        placeholder="e.g. 5.50"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                        Unit / Package *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1 dozen / 500g"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                        Badge (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Fresh Today"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                      Basic Product Description *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Short description of ingredients, harvest time, or flavor notes..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                      Image URL (optional photo)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 border border-[#2d2a26]/30 text-[#2d2a26] text-[10px] uppercase tracking-widest font-medium hover:border-[#2d2a26]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#2d2a26] text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium hover:bg-[#2d2a26]/90 border border-[#2d2a26]"
                    >
                      Save to Catalog
                    </button>
                  </div>
                </form>
              )}

              {/* Products List */}
              <div className="space-y-2">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-3 border border-[#2d2a26]/15 bg-[#f5f2ed] transition-colors gap-3"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover bg-[#e8e4de] shrink-0 border border-[#2d2a26]/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif italic text-sm text-[#2d2a26] truncate">
                          {prod.name}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest bg-[#fdfbf7] text-[#2d2a26]/70 border border-[#2d2a26]/15 px-1.5 py-0.5 font-medium">
                          {prod.category}
                        </span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-[#2d2a26]/60 truncate mt-0.5">
                        ${prod.price.toFixed(2)} • {prod.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleStock(prod.id)}
                        className={`text-[10px] uppercase tracking-wider px-2.5 py-1 font-medium transition-colors cursor-pointer border ${
                          prod.inStock
                            ? 'bg-[#2d2a26] text-[#fdfbf7] border-[#2d2a26]'
                            : 'bg-[#fdfbf7] text-[#2d2a26]/50 border-[#2d2a26]/20'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="p-1 text-[#2d2a26]/40 hover:text-[#2d2a26] transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Shop Info Form */
            <form onSubmit={handleSaveShopInfo} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#2d2a26]/70 mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#2d2a26]/70 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#2d2a26]/70 mb-1">
                    House Address / Porch Location
                  </label>
                  <input
                    type="text"
                    required
                    value={houseAddress}
                    onChange={(e) => setHouseAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#2d2a26]/70 mb-1">
                    Pickup Hours Window
                  </label>
                  <input
                    type="text"
                    value={pickupHours}
                    onChange={(e) => setPickupHours(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#2d2a26]/70 mb-1">
                  Contact Phone / WhatsApp (for neighbor messages)
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#2d2a26]/70 mb-1">
                  Pickup & Payment Instructions
                </label>
                <textarea
                  rows={3}
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#2d2a26] hover:bg-[#2d2a26]/90 text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium transition-colors cursor-pointer border border-[#2d2a26]"
                >
                  {infoSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Details Saved!</span>
                    </>
                  ) : (
                    <span>Save Shop Details</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f5f2ed] border-t border-[#2d2a26]/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#2d2a26] bg-[#2d2a26] text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium hover:bg-[#2d2a26]/90 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
