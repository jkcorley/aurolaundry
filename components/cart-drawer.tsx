'use client'

import { useState } from 'react'
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { cn } from '@/lib/utils'
import Image from 'next/image'

function CheckoutModal({ open, onClose, items, total, onConfirm }: { open: boolean, onClose: () => void, items: any[], total: number, onConfirm: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState('credit')
  const [submitted, setSubmitted] = useState(false)
  const [showTracking, setShowTracking] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded hover:bg-muted" aria-label="Close checkout">
          <X className="h-5 w-5" />
        </button>
        {showTracking ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
            <ol className="text-left mb-4">
              <li>1. Order received</li>
              <li>2. In progress</li>
              <li>3. Out for delivery</li>
              <li>4. Delivered</li>
            </ol>
            <button className="mt-2 px-4 py-2 bg-primary text-white rounded" onClick={onClose}>Close</button>
          </div>
        ) : submitted ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
            <p className="text-muted-foreground mb-4">Your order has been placed. This is a demo checkout.</p>
            <button className="mt-2 px-4 py-2 bg-primary text-white rounded mr-2" onClick={() => setShowTracking(true)}>Track Order</button>
            <button className="mt-2 px-4 py-2 bg-muted text-black rounded" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              setSubmitted(true);
              onConfirm();
            }}
          >
            <h2 className="text-xl font-semibold mb-2">Checkout</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input className="w-full border rounded px-2 py-1" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input className="w-full border rounded px-2 py-1" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input className="w-full border rounded px-2 py-1" value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <div className="flex gap-2">
                <label><input type="radio" name="payment" value="credit" checked={payment === 'credit'} onChange={() => setPayment('credit')} /> Credit Card</label>
                <label><input type="radio" name="payment" value="apple" checked={payment === 'apple'} onChange={() => setPayment('apple')} /> Apple Pay</label>
                <label><input type="radio" name="payment" value="google" checked={payment === 'google'} onChange={() => setPayment('google')} /> Google Pay</label>
                <label><input type="radio" name="payment" value="cash" checked={payment === 'cash'} onChange={() => setPayment('cash')} /> Cash</label>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <ul className="mb-2 max-h-32 overflow-y-auto">
                {items.map(item => (
                  <li key={item.api_product_id} className="flex justify-between text-sm mb-1">
                    <span>{item.product_title} x{item.quantity}</span>
                    <span>{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" className="w-full py-2 px-4 rounded bg-primary text-white font-medium mt-4">Place Order</button>
          </form>
        )}
      </div>
    </div>
  )
}

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-md hover:bg-muted touch-manipulation"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-lg transform transition-transform duration-200 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-muted touch-manipulation"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm">Add some products to your cart to see them here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.api_product_id} className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {item.main_image_url ? (
                        <Image
                          src={item.main_image_url}
                          alt={item.product_title}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-2">{item.product_title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.brand}</p>
                      <div className="font-semibold text-primary mb-2">{item.price}</div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.api_product_id, item.quantity - 1)}
                          className="p-1 rounded-md hover:bg-muted touch-manipulation"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.api_product_id, item.quantity + 1)}
                          className="p-1 rounded-md hover:bg-muted touch-manipulation"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.api_product_id)}
                          className="p-1 rounded-md hover:bg-muted text-red-500 touch-manipulation ml-auto"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 bg-white sticky bottom-0 left-0 right-0 z-10 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-semibold text-lg">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-3 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={items}
        total={totalPrice}
        onConfirm={() => {
          clearCart();
          setIsOpen(false);
        }}
      />
    </>
  )
} 