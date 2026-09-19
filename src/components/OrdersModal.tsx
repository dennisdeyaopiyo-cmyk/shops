import React from 'react';
import { X, CheckCircle, Clock, PackageCheck, Trash2, Calendar, MapPin, Phone } from 'lucide-react';
import { Order } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateStatus,
  onDeleteOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="orders-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#2d2a26]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="orders-modal-panel"
        className="bg-[#fdfbf7] text-[#2d2a26] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#2d2a26]/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2d2a26]/15 flex items-center justify-between bg-[#f5f2ed]">
          <div>
            <h3 className="font-serif italic text-xl text-[#2d2a26] flex items-center gap-2">
              <span>Neighbor Reservations</span>
              <span className="text-[10px] uppercase tracking-widest bg-[#fdfbf7] text-[#2d2a26] border border-[#2d2a26]/20 font-medium px-2 py-0.5">
                {orders.length}
              </span>
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-[#2d2a26]/60 mt-0.5">
              Track reservations placed by your neighbours for pickup or delivery
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

        {/* Content List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-[#2d2a26]/60">
              <PackageCheck className="w-10 h-10 mx-auto text-[#2d2a26]/30 mb-2" />
              <p className="font-serif italic text-lg text-[#2d2a26]">No reservations yet</p>
              <p className="text-xs text-[#2d2a26]/60 mt-1 max-w-sm mx-auto leading-relaxed">
                When neighbours reserve items from your catalog, they will appear here with contact and fulfillment details.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  id={`order-item-${order.id}`}
                  className="p-4 border border-[#2d2a26]/15 bg-[#f5f2ed] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2d2a26]/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-semibold text-[#2d2a26]">
                          #{order.id}
                        </span>
                        <span className="font-serif italic text-sm text-[#2d2a26]">
                          • {order.customerName}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#2d2a26]/60">
                          ({order.houseNumber})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-[#2d2a26]/60 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#2d2a26]" />
                          {order.deliveryMethod === 'pickup' ? 'Porch Pickup' : 'Neighbor Drop-off'}
                        </span>
                        {order.customerPhone && (
                          <span className="flex items-center gap-1 text-[#2d2a26]">
                            <Phone className="w-3 h-3" />
                            {order.customerPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateStatus(order.id, e.target.value as Order['status'])
                        }
                        className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 border border-[#2d2a26]/20 bg-[#fdfbf7] text-[#2d2a26] cursor-pointer focus:outline-none focus:border-[#2d2a26]"
                      >
                        <option value="reserved">⏳ Reserved</option>
                        <option value="ready">📦 Ready for Pickup</option>
                        <option value="completed">✅ Picked up / Done</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>

                      <button
                        onClick={() => onDeleteOrder(order.id)}
                        className="p-1 text-[#2d2a26]/40 hover:text-[#2d2a26] transition-colors"
                        title="Delete order record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Reserved Items */}
                  <div className="py-2.5 space-y-1 text-xs text-[#2d2a26]/80">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          <strong className="text-[#2d2a26]">{it.quantity}x</strong> {it.productName} ({it.unit})
                        </span>
                        <span className="font-medium text-[#2d2a26]">
                          ${(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Note if any */}
                  {order.notes && (
                    <div className="text-[11px] bg-[#fdfbf7] text-[#2d2a26]/80 p-2 border border-[#2d2a26]/10 mt-1">
                      <strong className="text-[#2d2a26]">Neighbor Note:</strong> {order.notes}
                    </div>
                  )}

                  {/* Footer Total */}
                  <div className="pt-2 border-t border-[#2d2a26]/10 flex justify-between items-center text-xs">
                    <span className="text-[10px] uppercase tracking-widest text-[#2d2a26]/60">Pay on pickup total:</span>
                    <span className="font-serif text-base text-[#2d2a26]">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f5f2ed] border-t border-[#2d2a26]/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#2d2a26] bg-[#2d2a26] text-[#fdfbf7] text-[10px] uppercase tracking-widest font-medium hover:bg-[#2d2a26]/90 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
