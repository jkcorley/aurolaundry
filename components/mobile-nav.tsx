'use client'

import { useState, useEffect } from 'react'
import { NavLink } from '@/components/nav-link'
import {
  Home,
  Building2,
  Settings2,
  Truck,
  Users,
  Calendar,
  Package,
  BarChart3,
  Map,
  Search,
  List,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md hover:bg-muted md:hidden touch-manipulation"
        aria-label="Open menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b safe-area-inset-top">
            <div className="flex items-center gap-3">
              <div className="bg-gray-900 rounded-lg p-2 flex items-center justify-center">
                <Settings2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">Auro Platform</div>
                <div className="text-xs text-muted-foreground">Admin Console</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-muted touch-manipulation"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 safe-area-inset-bottom">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Navigation
            </div>
            <NavLink href="/" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Home className="h-5 w-5" />Dashboard</span>
            </NavLink>
            <NavLink href="/laundromats" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Building2 className="h-5 w-5" />Laundromats</span>
            </NavLink>
            <NavLink href="/laundromats-map" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Map className="h-5 w-5" />Laundromats Map</span>
            </NavLink>
            <NavLink href="/laundromats-explore" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Search className="h-5 w-5" />Laundromats Explore</span>
            </NavLink>
            <NavLink href="/participating-laundromats" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><List className="h-5 w-5" />Participating Laundromats</span>
            </NavLink>
            <NavLink href="/machines" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Settings2 className="h-5 w-5" />Machines</span>
            </NavLink>
            <NavLink href="/drivers" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Truck className="h-5 w-5" />Drivers</span>
            </NavLink>
            <NavLink href="/users" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Users className="h-5 w-5" />Users</span>
            </NavLink>
            <NavLink href="/bookings" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Calendar className="h-5 w-5" />Bookings</span>
            </NavLink>
            <NavLink href="/orders" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Package className="h-5 w-5" />Orders</span>
            </NavLink>
            <NavLink href="/supply-orders" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Package className="h-5 w-5" />Supply Orders</span>
            </NavLink>
            <NavLink href="/laundry-products" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><Package className="h-5 w-5" />Laundry Products</span>
            </NavLink>
            <NavLink href="/analytics" onClick={() => setIsOpen(false)}>
              <span className="flex items-center gap-3"><BarChart3 className="h-5 w-5" />Analytics</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  )
} 