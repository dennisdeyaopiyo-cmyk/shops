import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, CheckCircle2, MessageSquare, Copy, Check, MapPin, Clock, Info } from 'lucide-react';
import { CartItem, DeliveryMethod, Order, ShopInfo } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
  shopInfo: ShopInfo;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  shopInfo,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !houseNumber.trim()) return;

    const newOrder: Order = {
      id: `NB-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      houseNumber: houseNumber.trim(),
      customerPhone: customerPhone.trim(),
      deliveryMethod,
      notes: notes.trim(),
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        unit: i.product.unit,
        price: i.product.price,
        quantity: i.quantity,
      })),
      total: totalAmount,
      status: 'reserved',
    };

    onOrderPlaced(newOrder);
    setConfirmedOrder(newOrder);
    onClearCart();
  };

  const generateWhatsAppMessage = (order: Order) => {
    const lines = [
      `👋 Hi neighbor! I placed a reservation for shop items:`,
      `Order Ref: ${order.id}`,
      `Name: ${order.customerName} (${order.houseNumber})`,
      `Fulfillment: ${order.deliveryMethod === 'pickup' ? 'Porch Pickup' : 'Neighbor Drop-off'}`,
      ...order.items.map(
        (it) => `• ${it.quantity}x ${it.productName} - $${(it.price * it.quantity).toFixed(2)}`
      ),
      `Total: $${order.total.toFixed(2)} (Will pay upon collection)`,
      order.notes ? `Note: ${order.notes}` : '',
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleCopySummary = (order: Order) => {
    const text = generateWhatsAppMessage(order);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsAppClick = (order: Order) => {
    const text = encodeURIComponent(generateWhatsAppMessage(order));
    const cleanPhone = shopInfo.contactPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleResetAndClose = () => {
    setConfirmedOrder(null);
    setCustomerName('');
    setHouseNumber('');
    setCustomerPhone('');
    setNotes('');
    onClose();
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-[#2d2a26]/40 backdrop-blur-xs flex justify-end"
      onClick={handleResetAndClose}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#fdfbf7] text-[#2d2a26] h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#2d2a26]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#2d2a26]/15 flex items-center justify-between bg-[#f5f2ed]">
          <div>
            <h2 className="font-serif italic text-xl text-[#2d2a26] flex items-center gap-2">
              <span>Neighbor Order Bag</span>
              {items.length > 0 && (
                <span className="text-[10px] uppercase tracking-widest bg-[#fdfbf7] text-[#2d2a26] border border-[#2d2a26]/20 font-medium px-2 py-0.5">
                  {items.reduce((acc, curr) => acc + curr.quantity, 0)} items
                </span>
              )}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-[#2d2a26]/60 mt-0.5">
              No online payment • Pay upon collection
            </p>
          </div>
          <button
            id="close-cart-btn"
            onClick={handleResetAndClose}
            className="p-1.5 border border-[#2d2a26]/20 hover:bg-[#2d2a26] hover:text-[#fdfbf7] text-[#2d2a26] transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        {confirmedOrder ? (
          /* Order Confirmation Screen */
          <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 border border-[#2d2a26] text-[#2d2a26] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif italic text-2xl text-center text-[#2d2a26]">
                Reservation Confirmed
              </h3>
              <p className="text-center text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2d2a26]/70 mt-1">
                Order Ref: #{confirmedOrder.id}
              </p>
              <p className="text-center text-xs text-[#2d2a26]/80 mt-2 leading-relaxed">
                Items reserved for <strong>{confirmedOrder.customerName}</strong> ({confirmedOrder.houseNumber}).
              </p>

              {/* Order breakdown */}
              <div className="mt-5 p-4 bg-[#f5f2ed] border border-[#2d2a26]/15 text-xs space-y-2">
                <div className="flex justify-between font-medium text-[10px] uppercase tracking-widest text-[#2d2a26]/70 pb-2 border-b border-[#2d2a26]/10">
                  <span>Reserved Goods</span>
                  <span>Subtotal</span>
                </div>
                {confirmedOrder.items.map((it) => (
                  <div key={it.productId} className="flex justify-between text-[#2d2a26]/80">
                    <span>{it.quantity}x {it.productName} ({it.unit})</span>
                    <span className="font-medium">${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#2d2a26]/10 flex justify-between font-serif text-base text-[#2d2a26]">
                  <span>Total (Pay on pickup):</span>
                  <span>${confirmedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Next Steps for Neighbour */}
              <div className="mt-4 p-3 bg-[#f5f2ed] border border-[#2d2a26]/15 text-xs text-[#2d2a26]/80 space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2d2a26] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Pickup Location: </span>
                    {shopInfo.houseAddress}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#2d2a26] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Hours: </span>
                    {shopInfo.pickupHours}
                  </div>
                </div>
                <p className="text-[11px] text-[#2d2a26]/60 pt-1">
                  {shopInfo.pickupNote}
                </p>
              </div>

              {/* Optional Quick Communication */}
              <div className="mt-4 space-y-2">
                <button
                  id="whatsapp-order-btn"
                  onClick={() => handleWhatsAppClick(confirmedOrder)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2d2a26] hover:bg-[#2d2a26]/90 text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium transition-colors cursor-pointer border border-[#2d2a26]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Order to Seller via WhatsApp</span>
                </button>

                <button
                  id="copy-order-btn"
                  onClick={() => handleCopySummary(confirmedOrder)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#2d2a26]/30 hover:border-[#2d2a26] bg-[#fdfbf7] text-[#2d2a26] text-[10px] uppercase tracking-widest font-medium transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Summary Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#2d2a26]/60" />
                      <span>Copy Order Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="mt-6 w-full py-2.5 bg-[#2d2a26] hover:bg-[#2d2a26]/90 text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium transition-colors border border-[#2d2a26]"
            >
              Done / Return to Catalog
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Bag */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 border border-[#2d2a26]/20 flex items-center justify-center mb-3 text-[#2d2a26]/40">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-lg text-[#2d2a26]">
              Your bag is currently empty
            </h3>
            <p className="text-xs text-[#2d2a26]/70 mt-1 max-w-xs leading-relaxed">
              Browse our neighborhood catalog and add fresh bread, garden produce, or treats to reserve!
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-4 py-2 border border-[#2d2a26] bg-[#2d2a26] text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium hover:bg-[#2d2a26]/90 transition-colors cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        ) : (
          /* Active Bag & Checkout Form */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 bg-[#f5f2ed] border border-[#2d2a26]/15"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover bg-[#e8e4de] shrink-0 border border-[#2d2a26]/10"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif italic text-sm text-[#2d2a26] truncate">
                      {product.name}
                    </h4>
                    <p className="text-[10px] uppercase tracking-widest text-[#2d2a26]/60">
                      ${product.price.toFixed(2)} • {product.unit}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center border border-[#2d2a26]/20 bg-[#fdfbf7]">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="px-2 py-0.5 text-[#2d2a26] hover:bg-[#2d2a26] hover:text-[#fdfbf7] transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-serif text-xs px-2 text-[#2d2a26]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-[#2d2a26] hover:bg-[#2d2a26] hover:text-[#fdfbf7] transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-serif text-xs text-[#2d2a26] ml-auto">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className="p-1.5 text-[#2d2a26]/40 hover:text-[#2d2a26] transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Reservation Form & Summary */}
            <form onSubmit={handleSubmitReservation} className="p-4 bg-[#f5f2ed] border-t border-[#2d2a26]/20 space-y-3">
              {/* Pickup vs Drop-off Toggle */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] font-semibold text-[#2d2a26]/70 mb-1">
                  Collection Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`py-1.5 px-3 text-[10px] uppercase tracking-widest font-medium border text-center transition-colors cursor-pointer ${
                      deliveryMethod === 'pickup'
                        ? 'bg-[#2d2a26] text-[#fdfbf7] border-[#2d2a26]'
                        : 'bg-[#fdfbf7] text-[#2d2a26] border-[#2d2a26]/30 hover:border-[#2d2a26]'
                    }`}
                  >
                    🏡 Porch Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('dropoff')}
                    className={`py-1.5 px-3 text-[10px] uppercase tracking-widest font-medium border text-center transition-colors cursor-pointer ${
                      deliveryMethod === 'dropoff'
                        ? 'bg-[#2d2a26] text-[#fdfbf7] border-[#2d2a26]'
                        : 'bg-[#fdfbf7] text-[#2d2a26] border-[#2d2a26]/30 hover:border-[#2d2a26]'
                    }`}
                  >
                    🚪 Neighbor Drop-off
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria / Tom"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                    House / Apt # *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. #38 or Apt 4B"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                  />
                </div>
              </div>

              {/* Optional Phone & Note */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                    Phone / WhatsApp (optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="For pickup text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2d2a26]/70 mb-0.5">
                    Pickup Note (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coming at 5pm"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-[#fdfbf7] border border-[#2d2a26]/20 focus:outline-none focus:border-[#2d2a26] text-[#2d2a26]"
                  />
                </div>
              </div>

              {/* Notice */}
              <div className="p-2 bg-[#fdfbf7] border border-[#2d2a26]/15 text-[10px] uppercase tracking-widest text-[#2d2a26]/70 flex items-center gap-1.5">
                <Info className="w-3 h-3 shrink-0" />
                <span>Pay when collecting: Cash or transfer upon pickup</span>
              </div>

              {/* Subtotal & Submit */}
              <div className="pt-2 border-t border-[#2d2a26]/15">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#2d2a26]/70 font-medium">Order Total:</span>
                  <span className="font-serif text-xl text-[#2d2a26]">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  id="submit-reservation-btn"
                  className="w-full py-2.5 px-4 bg-[#2d2a26] hover:bg-[#2d2a26]/90 text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#2d2a26]"
                >
                  <span>Confirm Neighbor Reservation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
